import { useEffect } from 'react'
import { motion } from 'framer-motion'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'
const FONT_SE = 'Georgia,"Times New Roman",serif'
const C = {
  bg: '#0a0a0a', bg2: '#0e0e0f',
  silver: '#c6c6c6', silver2: '#706f6f', silver3: '#3c3c3b',
  white: '#f6f6f6',
}

function Nav() {
  return (
    <nav style={{
      position:'fixed',top:0,left:0,right:0,zIndex:100,
      padding:'20px clamp(24px,6vw,80px)',
      display:'flex',alignItems:'center',justifyContent:'space-between',
      background:'rgba(10,10,10,0.88)',backdropFilter:'blur(12px)',
      borderBottom:`1px solid ${C.silver3}22`,
    }}>
      <a href="/" style={{textDecoration:'none'}}>
        <img src="/logos/logo-slogan-white.svg" alt="PRYM" style={{height:44,opacity:0.9}}
          onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='block'}} />
        <span style={{display:'none',fontFamily:FONT_EU,fontSize:13,letterSpacing:'0.35em',textTransform:'uppercase',color:C.white,fontWeight:300}}>PRYM</span>
      </a>
      <div style={{display:'flex',gap:'clamp(16px,4vw,40px)',alignItems:'center'}}>
        {[['La Flotte','/flotte'],['Expérience','/experience'],['Entreprises','/entreprises']].map(([l,h])=>(
          <a key={h} href={h} style={{fontFamily:FONT_EU,fontSize:8,letterSpacing:'0.3em',textTransform:'uppercase',color:C.silver3,textDecoration:'none',transition:'color 0.2s'}}
            onMouseEnter={e=>e.target.style.color=C.silver} onMouseLeave={e=>e.target.style.color=C.silver3}>{l}</a>
        ))}
        <a href="/reserver" style={{fontFamily:FONT_EU,fontSize:8,letterSpacing:'0.3em',textTransform:'uppercase',color:C.bg,background:C.silver,padding:'10px 20px',textDecoration:'none',transition:'all 0.2s'}}
          onMouseEnter={e=>e.target.style.background=C.white} onMouseLeave={e=>e.target.style.background=C.silver}>
          Réserver
        </a>
      </div>
    </nav>
  )
}

function Rule({ style }) {
  return <div style={{ width:'100%', height:1, background:`linear-gradient(90deg,transparent,${C.silver3},transparent)`, ...style }} />
}

function Section({ children, accent, style }) {
  return (
    <section style={{
      padding:'clamp(60px,8vw,100px) clamp(24px,6vw,80px)',
      background: accent ? C.bg2 : C.bg,
      borderBottom:`1px solid ${C.silver3}22`,
      ...style,
    }}>
      {children}
    </section>
  )
}

const VALEURS = [
  {
    n:'01', title:'Discrétion absolue',
    body:'Aucune conversation ne sort de l\'habitacle. Aucune information partagée. Chaque chauffeur signe un accord de confidentialité avant sa première course. La discrétion n\'est pas une politesse — c\'est une obligation contractuelle.',
  },
  {
    n:'02', title:'Ponctualité chirurgicale',
    body:'Le chauffeur arrive 5 minutes avant l\'heure convenue. Sans exception. Si un imprévu survient, vous êtes prévenu avant même d\'avoir regardé votre téléphone. La ponctualité est notre premier message au client.',
  },
  {
    n:'03', title:'Élégance du service',
    body:'Total black, Oshibori, eau en verre, température à 21°C, signature olfactive exclusive. Chaque détail est orchestré avant votre arrivée. Nous ne gérons pas des trajets — nous créons des expériences.',
  },
]

const CHIFFRES = [
  { value:'6', label:'Tiers de service', sub:'Du Select au Suite' },
  { value:'−5', label:'Minutes d\'avance', sub:'Systématiques' },
  { value:'21°', label:'Température standard', sub:'Dans chaque véhicule' },
  { value:'NDA', label:'Confidentialité', sub:'Garantie contractuelle' },
]

export default function AProposPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'À propos de PRYM — Né au Maroc, Pour le Monde'
    document.querySelector("meta[name=\"description\"]")?.setAttribute("content", "PRYM Executive Transport est né de l'hospitalité marocaine. Découvrez notre histoire, nos valeurs et notre positionnement unique entre le premium accessible et l'ultra-luxe.")
  }, [])

  return (
    <div style={{background:C.bg,minHeight:'100vh',color:C.white}}>
      <Nav />

      {/* Hero */}
      <section style={{
        minHeight:'100vh',display:'flex',flexDirection:'column',
        justifyContent:'flex-end',
        padding:'clamp(120px,16vw,180px) clamp(24px,6vw,80px) clamp(60px,8vw,100px)',
        background:`radial-gradient(ellipse at 30% 60%, #141416 0%, ${C.bg} 65%)`,
        borderBottom:`1px solid ${C.silver3}22`,
        position:'relative',
      }}>
        {/* Background text */}
        <div style={{
          position:'absolute',top:'50%',right:'clamp(24px,6vw,80px)',
          transform:'translateY(-50%)',
          fontFamily:FONT_EU,fontSize:'clamp(80px,15vw,200px)',
          letterSpacing:'-0.02em',color:`${C.silver3}12`,
          fontWeight:700,userSelect:'none',pointerEvents:'none',
          lineHeight:1,
        }}>
          PRYM
        </div>

        <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.3,duration:0.8}}
          style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.45em',textTransform:'uppercase',color:C.silver3,marginBottom:24,position:'relative',zIndex:1}}>
          À propos de PRYM
        </motion.p>

        <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.5,duration:1,ease:[0.22,1,0.36,1]}}
          style={{fontFamily:FONT_EU,fontWeight:300,fontSize:'clamp(32px,6vw,72px)',letterSpacing:'0.08em',textTransform:'uppercase',color:C.white,lineHeight:1.05,marginBottom:32,maxWidth:800,position:'relative',zIndex:1}}>
          Né au Maroc.<br />
          <span style={{color:C.silver}}>Pour le monde.</span>
        </motion.h1>

        <motion.div initial={{scaleX:0}} animate={{scaleX:1}} transition={{delay:0.9,duration:0.8,ease:[0.22,1,0.36,1]}}
          style={{width:80,height:1,background:`linear-gradient(90deg,${C.silver},transparent)`,marginBottom:32,position:'relative',zIndex:1}} />

        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.1,duration:0.8}}
          style={{fontFamily:FONT_SE,fontStyle:'italic',fontSize:'clamp(14px,2vw,18px)',color:C.silver2,lineHeight:1.9,maxWidth:560,position:'relative',zIndex:1}}>
          PRYM n'est pas un transporteur. C'est un concierge de mobilité. Le client ne voit pas le trajet — il vit une transition parfaite entre deux points. Le luxe silencieux, pas le luxe qui crie. Celui qui s'impose.
        </motion.p>
      </section>

      {/* L'origine */}
      <Section>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'clamp(40px,6vw,80px)',maxWidth:1100,margin:'0 auto'}}>
          <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.8}}>
            <p style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.4em',textTransform:'uppercase',color:C.silver3,marginBottom:20}}>
              L'origine
            </p>
            <h2 style={{fontFamily:FONT_EU,fontWeight:300,fontSize:'clamp(22px,3.5vw,36px)',letterSpacing:'0.08em',textTransform:'uppercase',color:C.white,marginBottom:24,lineHeight:1.15}}>
              L'hospitalité est notre héritage.
            </h2>
            <Rule style={{width:48,marginBottom:28,background:C.silver3}} />
          </motion.div>

          <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.8,delay:0.15}}
            style={{display:'flex',flexDirection:'column',gap:20}}>
            <p style={{fontFamily:FONT_SE,fontStyle:'italic',fontSize:'clamp(13px,1.5vw,16px)',color:C.silver2,lineHeight:1.9}}>
              Le Maroc a toujours été une terre d'accueil. Depuis les caravanes des anciennes routes commerciales jusqu'aux palaces de Marrakech, l'hospitalité n'est pas un service ici — c'est une philosophie millénaire.
            </p>
            <p style={{fontFamily:FONT_SE,fontStyle:'italic',fontSize:'clamp(13px,1.5vw,16px)',color:C.silver2,lineHeight:1.9}}>
              PRYM est né de cette conviction : le transport executive au Maroc méritait d'être réinventé. Pas copié sur des standards étrangers froids et impersonnels. Mais construit sur ce que nous avons toujours su faire — recevoir, avec précision et grâce.
            </p>
            <p style={{fontFamily:FONT_SE,fontStyle:'italic',fontSize:'clamp(13px,1.5vw,16px)',color:C.silver2,lineHeight:1.9}}>
              Le standard n'a pas changé. Nous l'avons juste perfectionné.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Chiffres clés */}
      <Section accent>
        <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{duration:0.7}}
          style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.4em',textTransform:'uppercase',color:C.silver3,marginBottom:48,textAlign:'center'}}>
          En chiffres
        </motion.p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:24,maxWidth:900,margin:'0 auto'}}>
          {CHIFFRES.map((c,i)=>(
            <motion.div key={c.label}
              initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{delay:i*0.1,duration:0.7}}
              style={{textAlign:'center',padding:'32px 16px',border:`1px solid ${C.silver3}33`,position:'relative'}}>
              <div style={{position:'absolute',top:0,left:0,width:16,height:1,background:C.silver2}} />
              <div style={{position:'absolute',top:0,left:0,width:1,height:16,background:C.silver2}} />
              <p style={{fontFamily:FONT_EU,fontSize:'clamp(28px,5vw,48px)',letterSpacing:'0.02em',color:C.white,marginBottom:8,lineHeight:1}}>
                {c.value}
              </p>
              <p style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.25em',textTransform:'uppercase',color:C.silver,marginBottom:6}}>
                {c.label}
              </p>
              <p style={{fontFamily:FONT_SE,fontStyle:'italic',fontSize:11,color:C.silver3}}>
                {c.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Les 3 valeurs */}
      <Section>
        <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{duration:0.7}}
          style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.4em',textTransform:'uppercase',color:C.silver3,marginBottom:48,textAlign:'center'}}>
          Nos trois piliers
        </motion.p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:24,maxWidth:1000,margin:'0 auto'}}>
          {VALEURS.map((v,i)=>(
            <motion.div key={v.n}
              initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}}
              viewport={{once:true,margin:'-40px'}} transition={{delay:i*0.1,duration:0.8}}
              style={{border:`1px solid ${C.silver3}33`,padding:'36px 28px',background:C.bg2,position:'relative'}}>
              <div style={{position:'absolute',top:0,left:0,width:20,height:1,background:C.silver2}} />
              <div style={{position:'absolute',top:0,left:0,width:1,height:20,background:C.silver2}} />
              <p style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.35em',textTransform:'uppercase',color:C.silver3,marginBottom:16}}>
                {v.n}
              </p>
              <h3 style={{fontFamily:FONT_EU,fontWeight:300,fontSize:18,letterSpacing:'0.12em',textTransform:'uppercase',color:C.white,marginBottom:20}}>
                {v.title}
              </h3>
              <Rule style={{width:36,marginBottom:20,background:C.silver3}} />
              <p style={{fontFamily:FONT_SE,fontStyle:'italic',fontSize:13,color:C.silver2,lineHeight:1.85}}>
                {v.body}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Le positionnement */}
      <Section accent>
        <div style={{maxWidth:720,margin:'0 auto',textAlign:'center'}}>
          <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{duration:0.7}}
            style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.4em',textTransform:'uppercase',color:C.silver3,marginBottom:24}}>
            Notre positionnement
          </motion.p>
          <motion.h2 initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.8,delay:0.1}}
            style={{fontFamily:FONT_EU,fontWeight:300,fontSize:'clamp(22px,4vw,40px)',letterSpacing:'0.08em',textTransform:'uppercase',color:C.white,marginBottom:24,lineHeight:1.15}}>
            Entre le premium accessible<br />
            <span style={{color:C.silver}}>et l'ultra-luxe inaccessible.</span>
          </motion.h2>
          <Rule style={{width:60,margin:'0 auto 32px'}} />
          <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{duration:0.7,delay:0.2}}
            style={{fontFamily:FONT_SE,fontStyle:'italic',fontSize:'clamp(13px,1.6vw,16px)',color:C.silver2,lineHeight:1.9,marginBottom:24}}>
            Les codes du haut de gamme, à un prix raisonnable. Aucun concurrent international ne peut revendiquer l'héritage marocain, la culture du service et de l'hospitalité. C'est notre avantage — et il est inimitable.
          </motion.p>
          <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{duration:0.7,delay:0.3}}
            style={{fontFamily:FONT_SE,fontStyle:'italic',fontSize:'clamp(13px,1.6vw,16px)',color:C.silver2,lineHeight:1.9}}>
            PRYM ne se limite pas au transport. Il s'agit d'une parenthèse de calme et luxueuse dans le chaos urbain.
          </motion.p>
        </div>
      </Section>

      {/* Closing manifeste */}
      <section style={{
        padding:'clamp(80px,12vw,140px) clamp(24px,6vw,80px)',
        textAlign:'center',
        background:`radial-gradient(ellipse at 50% 0%, #141416 0%, ${C.bg} 60%)`,
      }}>
        <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:1}}>
          <p style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.5em',textTransform:'uppercase',color:C.silver3,marginBottom:32}}>
            Driven by Excellence
          </p>
          <blockquote style={{
            fontFamily:FONT_SE,fontStyle:'italic',
            fontSize:'clamp(18px,3vw,28px)',
            color:C.silver,lineHeight:1.7,
            maxWidth:700,margin:'0 auto 48px',
            borderLeft:`2px solid ${C.silver3}`,
            paddingLeft:32,textAlign:'left',
          }}>
            "Le Maroc aura un nouveau standard.<br />
            Et il portera le nom de PRYM."
          </blockquote>
          <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
            <a href="/experience" style={{
              display:'inline-block',fontFamily:FONT_EU,fontSize:10,letterSpacing:'0.35em',
              textTransform:'uppercase',color:C.bg,background:C.silver,
              padding:'16px 40px',textDecoration:'none',transition:'all 0.3s',
            }}
              onMouseEnter={e=>e.target.style.background=C.white}
              onMouseLeave={e=>e.target.style.background=C.silver}>
              Découvrir l'expérience
            </a>
            <a href="/reserver" style={{
              display:'inline-block',fontFamily:FONT_EU,fontSize:10,letterSpacing:'0.35em',
              textTransform:'uppercase',color:C.silver,
              border:`1px solid ${C.silver3}`,
              padding:'16px 40px',textDecoration:'none',transition:'all 0.3s',
            }}
              onMouseEnter={e=>{e.target.style.borderColor=C.silver;e.target.style.color=C.white}}
              onMouseLeave={e=>{e.target.style.borderColor=C.silver3;e.target.style.color=C.silver}}>
              Demander un trajet
            </a>
          </div>
        </motion.div>
      </section>

      <div style={{borderTop:`1px solid ${C.silver3}22`,padding:'32px clamp(24px,6vw,80px)',textAlign:'center',background:C.bg2}}>
        <p style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.4em',textTransform:'uppercase',color:C.silver3}}>
          PRYM Executive Transport — Casablanca, Maroc
        </p>
      </div>
    </div>
  )
}
