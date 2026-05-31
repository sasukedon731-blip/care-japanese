"use client"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/app/lib/firebase"
import { quizzes } from "@/app/data/quizzes"
import type { QuizType } from "@/app/data/types"
import AppHeader from "@/app/components/AppHeader"
import LegalFooter from "@/app/components/LegalFooter"
import { quizCatalog } from "@/app/data/quizCatalog"

type Group={id:string;title:string;en:string;desc:string;quizIds:QuizType[];badge:string}
const GROUPS:Group[]=[
{id:"japanese",title:"日本語",en:"Japanese",desc:"N4・N3・N2の文法、語彙、読解、聴解を学習します。",quizIds:["japanese-n4","japanese-n3","japanese-n2"],badge:"border-blue-200 bg-blue-50 text-blue-700"},
{id:"care",title:"介護",en:"Care",desc:"介護用語、リスニング、現場会話を実務に近い形で学べます。",quizIds:["care-terms","care-listening","care-conversation"],badge:"border-emerald-200 bg-emerald-50 text-emerald-700"},
{id:"license",title:"資格",en:"License",desc:"介護福祉士試験対策で、資格に必要な知識を確認します。",quizIds:["care-worker-exam"],badge:"border-amber-200 bg-amber-50 text-amber-700"},
]
export default function SelectModePage(){const router=useRouter();const[loading,setLoading]=useState(true);useEffect(()=>onAuthStateChanged(auth,u=>{if(!u){router.replace("/login");return}setLoading(false)}),[router]);const enabled=useMemo(()=>new Set(quizCatalog.filter(q=>q.enabled!==false).map(q=>q.id)),[]);if(loading)return <div className="app-shell"><AppHeader/><main className="page-shell"><div className="ui-card"><p className="text-sub">読み込み中...</p></div></main></div>;return <div className="app-shell"><AppHeader title="学習を始める"/><main className="page-shell"><section className="ui-card"><p className="eyebrow">LEARNING MENU</p><h1 className="page-title">すべての学習メニュー</h1><p className="page-lead">日本語、介護、資格の学習メニューをまとめました。AI練習は専用ページに分けています。</p></section><section className="mt-6 section-stack">{GROUPS.map(g=><div key={g.id} className="ui-card"><span className={`ui-badge ${g.badge}`}>{g.en}</span><h2 className="mt-3 card-title">{g.title}</h2><p className="mt-2 text-sm leading-7 text-slate-700">{g.desc}</p><div className="grid-cards three mt-5">{g.quizIds.map(id=>{if(!enabled.has(id))return null;const q=quizzes[id];if(!q)return null;return <QuizCard key={id} id={id} title={q.title} description={q.description||"学習問題に取り組めます。"}/>})}</div></div>)}</section></main><LegalFooter/></div>}
function QuizCard({id,title,description}:{id:QuizType;title:string;description:string}){return <div className="ui-card-link bg-white"><div className="ui-card-body"><span className="ui-badge">Study</span><h3 className="mt-4 card-title">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-700">{description}</p><div className="ui-card-actions grid-cols-3 ui-action-three"><Link href={`/normal?type=${id}`} className="ui-btn ui-btn-primary">通常</Link><Link href={`/exam?type=${id}`} className="ui-btn ui-btn-sub">模擬</Link><Link href={`/review?type=${id}`} className="ui-btn ui-btn-success">復習</Link></div></div></div>}
