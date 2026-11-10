(function(){
  var rok=document.querySelector('[data-rok]'); if(rok) rok.textContent=new Date().getFullYear();

  // menu mobilne
  var b=document.querySelector('.burger'), nav=document.getElementById('menu');
  function zamknij(){nav.classList.remove('otw');b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Otwórz menu');document.body.style.overflow='';}
  if(b&&nav){
    b.addEventListener('click',function(){var o=nav.classList.toggle('otw');b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');document.body.style.overflow=o?'hidden':'';});
    nav.addEventListener('click',function(e){if(e.target.closest('a'))zamknij();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('otw'))zamknij();});
  }

  // aktywna pozycja menu + pasek mobilny
  var linki=[].slice.call(document.querySelectorAll('.nav>a'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){linki.forEach(function(a){a.classList.toggle('akt',a.getAttribute('href')==='#'+x.target.id);});}});},{rootMargin:'-45% 0px -50% 0px'});
    ['start','zakres','projekty','nagrody','klienci','pracownia','kontakt'].forEach(function(id){var s=document.getElementById(id); if(s) io.observe(s);});
    var mob=document.querySelector('.mob'), cta=document.querySelector('.hero-cta');
    if(mob&&cta){new IntersectionObserver(function(en){var v=!en[0].isIntersecting&&en[0].boundingClientRect.top<0;mob.classList.toggle('widac',v);mob.setAttribute('aria-hidden',!v);[].forEach.call(mob.querySelectorAll('a'),function(a){a.tabIndex=v?0:-1;});}).observe(cta);}
  }

  // pokaz w hero: automatycznie + palec/mysz + kreski
  var pokaz=document.querySelector('[data-pokaz]');
  if(pokaz){
    var sl=[].slice.call(pokaz.querySelectorAll('.slajd')), kr=[].slice.call(pokaz.querySelectorAll('.kropki button')), pd=pokaz.querySelector('.podpis'), nr=0, t=null;
    var ruchOgr=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function laduj(f){var s=f.querySelector('source[data-srcset]'),i=f.querySelector('img[data-src]'); if(s){s.srcset=s.dataset.srcset;s.removeAttribute('data-srcset');} if(i){i.src=i.dataset.src;i.removeAttribute('data-src');}}
    function idz(n){nr=(n+sl.length)%sl.length; laduj(sl[nr]); laduj(sl[(nr+1)%sl.length]);
      sl.forEach(function(s,i){s.classList.toggle('akt',i===nr);}); kr.forEach(function(k,i){k.classList.toggle('akt',i===nr);k.setAttribute('aria-selected',i===nr);});
      pd.innerHTML='<b>'+sl[nr].dataset.podpis+'</b><span>'+sl[nr].dataset.info+'</span>';}
    function start(){if(ruchOgr)return; clearInterval(t); t=setInterval(function(){idz(nr+1);},6500);}
    kr.forEach(function(k,i){k.addEventListener('click',function(){idz(i);start();});});
    var x0=null;
    pokaz.addEventListener('pointerdown',function(e){x0=e.clientX;});
    pokaz.addEventListener('pointerup',function(e){if(x0===null)return;var d=e.clientX-x0;x0=null;if(Math.abs(d)>40){idz(nr+(d<0?1:-1));start();}});
    pokaz.addEventListener('pointercancel',function(){x0=null;});
    setTimeout(function(){laduj(sl[1]);},1500);
    start();
  }

  // projekty: filtr + "pokaż wszystkie"
  var siatka=document.getElementById('siatka'), wiecej=document.getElementById('wiecej');
  if(siatka){
    var karty=[].slice.call(siatka.querySelectorAll('.karta'));
    karty.forEach(function(k,i){if(i>=6)k.classList.add('nad'); if(i>=4)k.classList.add('nad-tel');});
    [].forEach.call(document.querySelectorAll('.filtry button'),function(btn,_,all){
      btn.addEventListener('click',function(){
        [].forEach.call(document.querySelectorAll('.filtry button'),function(x){x.classList.toggle('akt',x===btn);x.setAttribute('aria-pressed',x===btn);});
        var f=btn.dataset.f;
        karty.forEach(function(k){k.hidden=!(f==='*'||k.dataset.kat.split(' ').indexOf(f)>-1);});
        if(f!=='*') siatka.classList.add('wszystkie');
      });
    });
    if(wiecej) wiecej.addEventListener('click',function(){siatka.classList.add('wszystkie');});
  }

  // galerie w kartach: palec, mysz, strzałki, licznik
  [].forEach.call(document.querySelectorAll('[data-gal]'),function(g){
    var tor=g.querySelector('.gal-tor'), n=tor.children.length, licz=g.querySelector('.gal-licz span');
    function w(){return tor.clientWidth;}
    function idz(d){var i=Math.round(tor.scrollLeft/w())+d; i=Math.max(0,Math.min(n-1,i)); tor.scrollTo({left:i*w(),behavior:'smooth'});}
    g.querySelector('.gal-prev').addEventListener('click',function(){idz(-1);});
    g.querySelector('.gal-next').addEventListener('click',function(){idz(1);});
    tor.addEventListener('scroll',function(){licz.textContent=Math.min(n,Math.round(tor.scrollLeft/w())+1);},{passive:true});
    tor.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){idz(1);e.preventDefault();}if(e.key==='ArrowLeft'){idz(-1);e.preventDefault();}});
    var s=null,sl0=0,ruch=false;
    tor.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;s=e.clientX;sl0=tor.scrollLeft;ruch=false;e.preventDefault();});
    window.addEventListener('pointermove',function(e){if(s===null)return;var d=e.clientX-s;if(Math.abs(d)>5){ruch=true;tor.classList.add('ciag');}if(ruch)tor.scrollLeft=sl0-d;});
    window.addEventListener('pointerup',function(e){if(s===null)return;var d=e.clientX-s;s=null;if(ruch){tor.classList.remove('ciag');var i=Math.round((sl0-d)/w()); if(Math.abs(d)>w()*0.12){i=Math.round(sl0/w())+(d<0?1:-1);} i=Math.max(0,Math.min(n-1,i)); tor.scrollTo({left:i*w(),behavior:'smooth'});}});
    tor.addEventListener('click',function(e){if(ruch){e.preventDefault();e.stopPropagation();ruch=false;}},true);
  });

  // formularz pokazowy
  var form=document.getElementById('form');
  if(form) form.addEventListener('submit',function(e){e.preventDefault();document.getElementById('form-info').textContent='To podgląd strony: formularz niczego nie wysyła. Na gotowej stronie zapytanie trafi na biuro@silesiaarchitekci.pl.';});
})();
