tailwind.config = {
  darkMode: 'class',
  theme: { extend: { screens: { lg: '900px' }, colors: { bg:'#0b0c10', surface:{DEFAULT:'#12141c',elevated:'#171a25',subtle:'#0f1118',card:'#141722',border:'#1f2433'}, brand:{cyan:'#11D6FF',blue:'#1478FF'}, fin:{profit:'#2EE6A6',loss:'#FF5C6C',warning:'#FFB547',target:'#2EE6A6'} }, fontFamily:{sora:['Sora','sans-serif'],inter:['Inter','sans-serif'],mono:['JetBrains Mono','monospace']}, boxShadow:{'cyan-glow':'0 0 25px rgba(17,214,255,.25)','cyan-sm':'0 0 10px rgba(17,214,255,.35)','profit-glow':'0 0 20px rgba(46,230,166,.2)','loss-glow':'0 0 20px rgba(255,92,108,.2)','panel':'0 8px 32px rgba(0,0,0,.45)'} } }
};
