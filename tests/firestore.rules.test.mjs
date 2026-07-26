import { after, before, test } from "node:test"
import fs from "node:fs"
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"

const PROJECT_ID = "demo-care-japanese"
let testEnv

const user = (uid) => testEnv.authenticatedContext(uid).firestore()
const unauthenticated = () => testEnv.unauthenticatedContext().firestore()

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: fs.readFileSync("firestore.rules", "utf8") },
  })

  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore()
    await Promise.all([
      setDoc(doc(db, "users", "learnerA"), {
        uid: "learnerA",
        role: "learner",
        accountType: "company",
        companyCode: "CARE_A",
        companyId: null,
        companyName: "Care A",
        billing: { status: "active", accountType: "company" },
        createdAt: "original",
      }),
      setDoc(doc(db, "users", "learnerB"), {
        uid: "learnerB",
        role: "learner",
        accountType: "company",
        companyCode: "CARE_B",
      }),
      setDoc(doc(db, "users", "companyAdminA"), {
        uid: "companyAdminA",
        role: "company_admin",
        accountType: "company",
        companyCode: "CARE_A",
      }),
      setDoc(doc(db, "users", "companyAdminB"), {
        uid: "companyAdminB",
        role: "company_admin",
        accountType: "company",
        companyCode: "CARE_B",
      }),
      setDoc(doc(db, "users", "rootAdmin"), {
        uid: "rootAdmin",
        role: "admin",
      }),
      setDoc(doc(db, "users", "personalUser"), {
        uid: "personalUser",
        role: "learner",
        accountType: "personal",
      }),
      setDoc(doc(db, "users", "learnerA", "results", "exam1"), {
        quizType: "care-worker-exam",
        score: 8,
        total: 10,
      }),
      setDoc(doc(db, "users", "learnerA", "progress", "care-terms"), {
        quizType: "care-terms",
        totalSessions: 2,
      }),
      setDoc(doc(db, "companies", "CARE_A"), {
        name: "Care A",
        status: "active",
      }),
      setDoc(doc(db, "companies", "CARE_B"), {
        name: "Care B",
        status: "active",
      }),
      setDoc(doc(db, "companies", "CARE_INACTIVE"), {
        name: "Inactive",
        status: "inactive",
      }),
    ])
  })
})

after(async () => {
  await testEnv?.cleanup()
})

test("01 [DENY] unauthenticated user cannot read users", async () => {
  await assertFails(getDoc(doc(unauthenticated(), "users", "learnerA")))
})

test("02 [ALLOW] learner can read own user document", async () => {
  await assertSucceeds(getDoc(doc(user("learnerA"), "users", "learnerA")))
})

test("03 [DENY] learner cannot read another user", async () => {
  await assertFails(getDoc(doc(user("learnerA"), "users", "learnerB")))
})

test("04 [ALLOW] company admin can read learner in own company", async () => {
  await assertSucceeds(getDoc(doc(user("companyAdminA"), "users", "learnerA")))
})

test("05 [DENY] company admin cannot read learner in another company", async () => {
  await assertFails(getDoc(doc(user("companyAdminA"), "users", "learnerB")))
})

test("06 [ALLOW] company admin can query users in own company", async () => {
  const users = collection(user("companyAdminA"), "users")
  await assertSucceeds(getDocs(query(users, where("companyCode", "==", "CARE_A"))))
})

test("07 [DENY] company admin cannot query another company", async () => {
  const users = collection(user("companyAdminA"), "users")
  await assertFails(getDocs(query(users, where("companyCode", "==", "CARE_B"))))
})

test("08 [DENY] company admin cannot list all users", async () => {
  await assertFails(getDocs(collection(user("companyAdminA"), "users")))
})

test("09 [ALLOW] admin can read management data", async () => {
  await assertSucceeds(getDoc(doc(user("rootAdmin"), "users", "learnerB")))
})

test("10 [ALLOW] learner can read own result", async () => {
  await assertSucceeds(getDoc(doc(user("learnerA"), "users", "learnerA", "results", "exam1")))
})

test("11 [ALLOW] learner can save own result", async () => {
  await assertSucceeds(
    setDoc(doc(user("learnerA"), "users", "learnerA", "results", "exam2"), {
      quizType: "japanese-n4",
      score: 7,
      total: 10,
    }),
  )
})

test("12 [ALLOW] same-company admin can read result", async () => {
  await assertSucceeds(getDoc(doc(user("companyAdminA"), "users", "learnerA", "results", "exam1")))
})

test("13 [DENY] other-company admin cannot read result", async () => {
  await assertFails(getDoc(doc(user("companyAdminB"), "users", "learnerA", "results", "exam1")))
})

test("14 [ALLOW] learner can read own progress", async () => {
  await assertSucceeds(getDoc(doc(user("learnerA"), "users", "learnerA", "progress", "care-terms")))
})

test("15 [ALLOW] learner can save own progress", async () => {
  await assertSucceeds(
    setDoc(doc(user("learnerA"), "users", "learnerA", "progress", "care-listening"), {
      quizType: "care-listening",
      totalSessions: 1,
    }),
  )
})

test("16 [ALLOW] same-company admin can read progress", async () => {
  await assertSucceeds(getDoc(doc(user("companyAdminA"), "users", "learnerA", "progress", "care-terms")))
})

test("17 [DENY] other-company admin cannot read progress", async () => {
  await assertFails(getDoc(doc(user("companyAdminB"), "users", "learnerA", "progress", "care-terms")))
})

const protectedUpdates = [
  ["role", "admin"],
  ["companyCode", "CARE_B"],
  ["companyId", "other"],
  ["companyName", "Other Care"],
  ["accountType", "personal"],
  ["billing", { status: "canceled" }],
  ["uid", "other"],
  ["createdAt", "changed"],
]

for (const [index, [field, value]] of protectedUpdates.entries()) {
  test(`${String(index + 18).padStart(2, "0")} [DENY] learner cannot change ${field}`, async () => {
    await assertFails(updateDoc(doc(user("learnerA"), "users", "learnerA"), { [field]: value }))
  })
}

test("26 [ALLOW] authenticated user can get active company for registration", async () => {
  await assertSucceeds(getDoc(doc(user("newCompanyUser"), "companies", "CARE_A")))
})

test("27 [DENY] authenticated user cannot get inactive company", async () => {
  await assertFails(getDoc(doc(user("newCompanyUser"), "companies", "CARE_INACTIVE")))
})

test("28 [DENY] learner cannot list companies", async () => {
  await assertFails(getDocs(collection(user("personalUser"), "companies")))
})

test("29 [DENY] company admin cannot list companies", async () => {
  await assertFails(getDocs(collection(user("companyAdminA"), "companies")))
})

test("30 [ALLOW] authenticated registration can create own company learner profile", async () => {
  await assertSucceeds(
    setDoc(doc(user("newCompanyUser"), "users", "newCompanyUser"), {
      uid: "newCompanyUser",
      role: "learner",
      accountType: "company",
      companyCode: "CARE_A",
      companyName: "Care A",
      billing: { status: "active", accountType: "company" },
      createdAt: "registration",
    }),
  )
})

test("31 [DENY] registration cannot create profile with nonexistent company", async () => {
  await assertFails(
    setDoc(doc(user("badCompanyUser"), "users", "badCompanyUser"), {
      uid: "badCompanyUser",
      role: "learner",
      accountType: "company",
      companyCode: "DOES_NOT_EXIST",
    }),
  )
})
