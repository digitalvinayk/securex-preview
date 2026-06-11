
// Mobile hamburger toggle (header navigation)
(function(){
  var btn = document.getElementById('mobileToggle');
  var nav = document.querySelector('.header-nav');
  if(!btn || !nav) return;
  btn.addEventListener('click', function(){
    var open = nav.classList.toggle('is-open');
    btn.classList.toggle('is-active', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  // Close menu when a link inside it is clicked
  nav.addEventListener('click', function(e){
    if(e.target.tagName === 'A' && nav.classList.contains('is-open')){
      nav.classList.remove('is-open');
      btn.classList.remove('is-active');
      btn.setAttribute('aria-expanded','false');
    }
  });
})();

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(function(btn){
  btn.addEventListener('click',function(){
    var item=btn.parentElement;
    var answer=item.querySelector('.faq-answer');
    var isActive=item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(function(el){
      el.classList.remove('active');
      el.querySelector('.faq-answer').style.maxHeight='0';
    });
    if(!isActive){
      item.classList.add('active');
      answer.style.maxHeight=answer.scrollHeight+'px';
    }
  });
});

// ===== VERISURE-STYLE FUNNEL =====
(function(){
  // Each step = single question. Phases: 0 Service, 1 Property, 2 System, 3 Review, 4 Contact.
  // Matches all 5 questions from the original Securex form.
  var STEPS=[
    // PHASE 0 - SERVICE
    {key:'serviceType',phase:0,q:'What do you need?',sub:'Select the primary service you are interested in.',opts:[
      {v:'New Installation',i:'fa-screwdriver-wrench'},
      {v:'Service & Maintenance',i:'fa-shield-halved'}
    ]},
    // PHASE 1 - PROPERTY
    {key:'propertyType',phase:1,q:'What kind of property needs securing?',sub:'Choose the type that best matches your premises.',opts:[
      {v:'Residential',i:'fa-house'},
      {v:'Commercial',i:'fa-building'}
    ]},
    // PHASE 2 - SYSTEM (branches by serviceType)
    // For New Installation: rooms (multi) + monitoring + communication
    {key:'rooms',phase:2,q:'Which areas need protecting?',sub:'Click any area to see the devices available for that room. You can add as many areas as you like.',type:'rooms',onlyIf:function(d){return d.serviceType==='New Installation';},roomsByKind:{
      Residential:[
        {name:'Front Door',icon:'fa-door-closed',sensors:['Door Contact']},
        {name:'Entrance Hall',icon:'fa-person-walking',sensors:['Magnetic Contact','Motion Sensor','Shock Sensor','Panic Button','Smoke Detector']},
        {name:'Lounge',icon:'fa-couch',sensors:['Magnetic Contact','Motion Sensor','Shock Sensor','Panic Button','Smoke Detector']},
        {name:'Kitchen',icon:'fa-utensils',sensors:['Magnetic Contact','Motion Sensor','Shock Sensor','Panic Button','Heat Detector']},
        {name:'Utility Room',icon:'fa-soap',sensors:['Magnetic Contact','Motion Sensor','Shock Sensor','Smoke Detector']},
        {name:'WC',icon:'fa-toilet',sensors:['Magnetic Contact','Motion Sensor','Shock Sensor']},
        {name:'Landing',icon:'fa-stairs',sensors:['Magnetic Contact','Motion Sensor','Shock Sensor','Panic Button','Smoke Detector']},
        {name:'Bedroom',icon:'fa-bed',sensors:['Magnetic Contact','Motion Sensor','Shock Sensor','Panic Button','Smoke Detector']},
        {name:'Bathroom',icon:'fa-bath',sensors:['Motion Sensor','Shock Sensor']},
        {name:'Loft Room',icon:'fa-warehouse',sensors:['Motion Sensor','Shock Sensor','Smoke Detector']},
        {name:'Garage',icon:'fa-car',sensors:['Magnetic Contact','Motion Sensor','Shock Sensor','Smoke Detector']},
        {name:'Shed / Storage',icon:'fa-box',sensors:['Magnetic Contact','Motion Sensor','Shock Sensor','Smoke Detector']},
        {name:'Outbuilding',icon:'fa-house-chimney',sensors:['Door Contact','Motion Sensor','Shock Sensor','Panic Button','Smoke Detector']},
        {name:'External Area',icon:'fa-tree',sensors:['CCTV Camera','External Siren','Motion Sensor']}
      ],
      Commercial:[
        {name:'Front Door',icon:'fa-door-closed',sensors:['Door Contact']},
        {name:'Entrance Lobby',icon:'fa-person-walking',sensors:['Magnetic Contact','Motion Sensor','Shock Sensor','Smoke Detector','Panic Button']},
        {name:'Reception',icon:'fa-bell-concierge',sensors:['Magnetic Contact','Motion Sensor','Panic Button','Smoke Detector','Shock Sensor']},
        {name:'Office / Room',icon:'fa-briefcase',sensors:['Magnetic Contact','Motion Sensor','Shock Sensor','Panic Button','Smoke Detector']},
        {name:'Kitchen',icon:'fa-utensils',sensors:['Magnetic Contact','Motion Sensor','Heat Detector','Shock Sensor','Panic Button']},
        {name:'Shop Front',icon:'fa-shop',sensors:['Magnetic Contact','Motion Sensor','Shock Sensor','Panic Button']},
        {name:'Storage Room',icon:'fa-box',sensors:['Magnetic Contact','Motion Sensor','Smoke Detector']},
        {name:'Warehouse',icon:'fa-warehouse',sensors:['Magnetic Contact','Motion Sensor','Shock Sensor','Smoke Detector','Panic Button']}
      ]
    }},
    {key:'monitoring',phase:2,q:'What level of monitoring would you like?',sub:'Choose how you want your system to respond to alerts.',onlyIf:function(d){return d.serviceType==='New Installation';},opts:[
      {v:'No Monitoring',i:'fa-ban'},
      {v:'App Notifications',i:'fa-mobile-screen'},
      {v:'Guard Response',i:'fa-user-shield'},
      {v:'Keyholder Response',i:'fa-key'},
      {v:'Police Response',i:'fa-shield-halved'}
    ]},
    {key:'communication',phase:2,q:'How should your system communicate?',sub:'Pick the connection method for alerts and updates.',onlyIf:function(d){return d.serviceType==='New Installation';},opts:[
      {v:'Wi-Fi',i:'fa-wifi'},
      {v:'4G / GPRS',i:'fa-signal'},
      {v:'Hardwired LAN',i:'fa-network-wired'}
    ]},
    // For Service & Maintenance: make + type + count
    {key:'make',phase:2,q:'Who manufactured your existing system?',sub:'Tell us the brand of your current alarm or CCTV system.',onlyIf:function(d){return d.serviceType==='Service & Maintenance';},opts:[
      {v:'Honeywell',i:'fa-microchip'},
      {v:'Pyronix',i:'fa-shield'},
      {v:'Texecom',i:'fa-network-wired'},
      {v:'Visonic',i:'fa-tower-broadcast'},
      {v:'Other / Not sure',i:'fa-question'}
    ]},
    {key:'connection',phase:2,q:'What type of connection does it use?',sub:'Select how your existing system is wired.',onlyIf:function(d){return d.serviceType==='Service & Maintenance';},opts:[
      {v:'Wired System',i:'fa-plug'},
      {v:'Wireless System',i:'fa-wifi'},
      {v:'Hybrid (Wired + Wireless)',i:'fa-shuffle'}
    ]},
    {key:'deviceCount',phase:2,q:'Roughly how many devices are installed?',sub:'An approximate count is fine. This helps us prepare the right quote.',onlyIf:function(d){return d.serviceType==='Service & Maintenance';},opts:[
      {v:'1 to 5 devices',i:'fa-1'},
      {v:'6 to 10 devices',i:'fa-6'},
      {v:'11 to 20 devices',i:'fa-hashtag'},
      {v:'More than 20',i:'fa-chart-simple'}
    ]},
    // PHASE 3 - REVIEW
    {key:'review',phase:3,q:'Review your details',sub:'Please check the summary before we prepare your free, no-obligation quote.',type:'review'},
    // PHASE 4 - CONTACT
    {key:'contact',phase:4,q:'Who should we call with your free quote?',sub:'A Securex expert will call you within 24 hours.',type:'contact'}
  ];
  var fStep=0;
  var fData={};
  var timerStart=Date.now();
  var timerSeconds=60;
  var timerInt=null;
  // Room staging state (for the per-area sensor picker)
  var stagingIdx=null;        // index into current rooms list being configured
  var stagingSensors=[];      // sensors selected in the staging panel

  function qs(s){return document.querySelector(s);}
  function qsa(s){return document.querySelectorAll(s);}

  function updatePhases(){
    var curPhase=STEPS[fStep].phase;
    qsa('.vfn-phase').forEach(function(el,i){
      el.classList.remove('active','done');
      if(i<curPhase) el.classList.add('done');
      else if(i===curPhase) el.classList.add('active');
    });
  }

  function updateButtons(){
    qs('#funnelBack').disabled=(fStep===0);
    var nextBtn=qs('#funnelNext');
    while(nextBtn.firstChild) nextBtn.removeChild(nextBtn.firstChild);
    var step=STEPS[fStep];
    var labelText,iconClass='fa-arrow-right';
    if(step.type==='contact'){labelText='Get My Free Quote ';iconClass='fa-paper-plane';}
    else if(step.type==='review'){labelText='Confirm & Continue ';}
    else labelText='Continue ';
    nextBtn.appendChild(document.createTextNode(labelText));
    var ic=document.createElement('i');ic.className='fas '+iconClass;
    nextBtn.appendChild(ic);
    // Single-select options auto-advance, so hide Continue until a pick
    if((step.opts || step.optsByKind) && !step.multi){
      nextBtn.style.visibility=fData[step.key]?'visible':'hidden';
    } else {
      nextBtn.style.visibility='visible';
    }
  }

  function tick(){
    var elapsed=Math.floor((Date.now()-timerStart)/1000);
    var remain=Math.max(0,timerSeconds-elapsed);
    var el=qs('#vfnTimer');
    if(el) el.textContent=remain;
    if(remain<=0 && timerInt){clearInterval(timerInt);timerInt=null;}
  }

  function showError(msg){
    var c=qs('#funnelQ');
    var ex=qs('.vfn-error');
    if(ex) ex.remove();
    var err=document.createElement('div');err.className='vfn-error show';
    var ic=document.createElement('i');ic.className='fas fa-circle-exclamation';
    err.appendChild(ic);
    err.appendChild(document.createTextNode(msg));
    c.insertBefore(err,c.firstChild);
    setTimeout(function(){if(err.parentNode) err.remove();},4000);
  }

  function scrollTop(){
    var card=qs('#funnelCard');if(!card) return;
    var rect=card.getBoundingClientRect();
    var top=rect.top+window.pageYOffset-100;
    window.scrollTo({top:top,behavior:'smooth'});
  }

  function createPillOption(v,i,key,selected,multi){
    var btn=document.createElement('button');
    btn.type='button';
    var isSel=multi ? (Array.isArray(selected)&&selected.indexOf(v)>=0) : (selected===v);
    btn.className='vfn-opt'+(isSel?' selected':'');
    // Icon
    var iconWrap=document.createElement('div');iconWrap.className='vfn-opt-icon';
    var ic=document.createElement('i');ic.className='fas '+i;
    iconWrap.appendChild(ic);
    btn.appendChild(iconWrap);
    // Label
    var lbl=document.createElement('span');lbl.className='vfn-opt-label';lbl.textContent=v;
    btn.appendChild(lbl);
    // Arrow / check indicator
    var arr=document.createElement('i');
    arr.className=multi ? 'fas fa-check vfn-opt-arrow' : 'fas fa-arrow-right vfn-opt-arrow';
    btn.appendChild(arr);
    btn.addEventListener('click',function(){
      if(multi){
        if(!Array.isArray(fData[key])) fData[key]=[];
        var idx=fData[key].indexOf(v);
        if(idx>=0){fData[key].splice(idx,1);btn.classList.remove('selected');}
        else{fData[key].push(v);btn.classList.add('selected');}
        updateButtons();
        return;
      }
      btn.parentElement.querySelectorAll('.vfn-opt').forEach(function(x){x.classList.remove('selected');});
      btn.classList.add('selected');
      fData[key]=v;
      // Auto-advance after brief delay for feedback (single-select only)
      setTimeout(function(){advance();},320);
    });
    return btn;
  }

  // ---- Rooms step: click an area -> pick its sensors -> Add to System ----
  function renderRoomsStep(c,step){
    var list=step.roomsByKind[fData.propertyType]||step.roomsByKind.Residential;
    if(!Array.isArray(fData.rooms)) fData.rooms=[];

    // Grid of area pills (2-col when >=6). Click to open staging.
    var grid=document.createElement('div');
    grid.className='vfn-opts'+(list.length>=6?' two-col':'');
    list.forEach(function(room,idx){
      var added=fData.rooms.some(function(r){return r.name===room.name;});
      var isStaging=(stagingIdx===idx);
      var btn=document.createElement('button');
      btn.type='button';
      btn.className='vfn-opt'+(added?' selected':'')+(isStaging?' staging':'');
      // Icon tile
      var ico=document.createElement('div');ico.className='vfn-opt-icon';
      var i=document.createElement('i');i.className='fas '+room.icon;ico.appendChild(i);
      btn.appendChild(ico);
      // Label
      var lbl=document.createElement('span');lbl.className='vfn-opt-label';
      lbl.textContent=room.name;
      btn.appendChild(lbl);
      // Right indicator: count badge if added, else arrow/plus
      var right=document.createElement('i');
      if(added){
        right.className='fas fa-check vfn-opt-arrow';
        var existing=fData.rooms.filter(function(r){return r.name===room.name;})[0];
        lbl.textContent=room.name+' ('+existing.sensors.length+')';
      } else {
        right.className='fas fa-plus vfn-opt-arrow';
      }
      btn.appendChild(right);
      btn.addEventListener('click',function(){
        // Open staging for this room (pre-fill sensors if already added)
        stagingIdx=idx;
        var existing=fData.rooms.filter(function(r){return r.name===room.name;})[0];
        stagingSensors=existing ? existing.sensors.slice() : [];
        render();
      });
      grid.appendChild(btn);
    });
    c.appendChild(grid);

    // Staging panel inline below the area grid (when a room is open)
    if(stagingIdx!==null && list[stagingIdx]){
      var room=list[stagingIdx];
      var panel=document.createElement('div');panel.className='vfn-stage';
      // Header
      var head=document.createElement('div');head.className='vfn-stage-head';
      var headIcon=document.createElement('i');headIcon.className='fas '+room.icon+' vfn-stage-head-icon';
      head.appendChild(headIcon);
      var headTitle=document.createElement('div');
      var t1=document.createElement('div');t1.className='vfn-stage-title';t1.textContent=room.name;
      var t2=document.createElement('div');t2.className='vfn-stage-sub';t2.textContent='Select the devices you want installed here';
      headTitle.appendChild(t1);headTitle.appendChild(t2);
      head.appendChild(headTitle);
      var closeBtn=document.createElement('button');closeBtn.type='button';closeBtn.className='vfn-stage-close';
      var cIc=document.createElement('i');cIc.className='fas fa-xmark';closeBtn.appendChild(cIc);
      closeBtn.title='Cancel';
      closeBtn.addEventListener('click',function(){stagingIdx=null;stagingSensors=[];render();});
      head.appendChild(closeBtn);
      panel.appendChild(head);
      // Sensor chips
      var chips=document.createElement('div');chips.className='vfn-stage-chips';
      room.sensors.forEach(function(s){
        var chip=document.createElement('button');
        chip.type='button';
        chip.className='vfn-chip'+(stagingSensors.indexOf(s)>=0?' active':'');
        var cIc=document.createElement('i');cIc.className='fas '+sensorIcon(s);
        chip.appendChild(cIc);
        var txt=document.createElement('span');txt.textContent=s;
        chip.appendChild(txt);
        chip.addEventListener('click',function(){
          var pos=stagingSensors.indexOf(s);
          if(pos>=0) stagingSensors.splice(pos,1); else stagingSensors.push(s);
          render();
        });
        chips.appendChild(chip);
      });
      panel.appendChild(chips);
      // Add button
      var addRow=document.createElement('div');addRow.className='vfn-stage-actions';
      var addBtn=document.createElement('button');addBtn.type='button';addBtn.className='vfn-stage-add';
      addBtn.disabled=stagingSensors.length===0;
      var alreadyHave=fData.rooms.some(function(r){return r.name===room.name;});
      addBtn.textContent=alreadyHave ? 'Update Area in System' : 'Add Area to System';
      var aic=document.createElement('i');aic.className='fas fa-circle-plus';addBtn.insertBefore(aic,addBtn.firstChild);
      addBtn.addEventListener('click',function(){
        if(stagingSensors.length===0) return;
        // Upsert
        var idx2=-1;fData.rooms.forEach(function(r,i){if(r.name===room.name) idx2=i;});
        var entry={name:room.name,icon:room.icon,sensors:stagingSensors.slice()};
        if(idx2>=0) fData.rooms[idx2]=entry; else fData.rooms.push(entry);
        stagingIdx=null;stagingSensors=[];
        render();
      });
      addRow.appendChild(addBtn);
      // Remove link (if editing existing)
      if(alreadyHave){
        var rmBtn=document.createElement('button');rmBtn.type='button';rmBtn.className='vfn-stage-remove';
        var rIc=document.createElement('i');rIc.className='fas fa-trash';rmBtn.appendChild(rIc);
        rmBtn.appendChild(document.createTextNode(' Remove'));
        rmBtn.addEventListener('click',function(){
          fData.rooms=fData.rooms.filter(function(r){return r.name!==room.name;});
          stagingIdx=null;stagingSensors=[];render();
        });
        addRow.appendChild(rmBtn);
      }
      panel.appendChild(addRow);
      c.appendChild(panel);
    }

    // Summary count hint
    if(fData.rooms.length>0){
      var count=document.createElement('div');count.className='vfn-rooms-count';
      var ic=document.createElement('i');ic.className='fas fa-circle-check';
      count.appendChild(ic);
      var sp=document.createElement('span');
      sp.textContent=fData.rooms.length+' '+(fData.rooms.length===1?'area':'areas')+' configured. Add more or press Continue.';
      count.appendChild(sp);
      c.appendChild(count);
    }
  }

  // Map sensor name -> Font Awesome icon
  function sensorIcon(s){
    var m={'Door Contact':'fa-door-open','Magnetic Contact':'fa-magnet','Motion Sensor':'fa-person-walking','Shock Sensor':'fa-bolt','Panic Button':'fa-bell','Smoke Detector':'fa-smog','Heat Detector':'fa-temperature-high','Flood Detector':'fa-droplet','Glass Break Sensor':'fa-glass-water-droplet','External Siren':'fa-volume-high','CCTV Camera':'fa-video','Video Doorbell':'fa-bell-concierge'};
    return m[s]||'fa-circle-dot';
  }

  function render(){
    var c=qs('#funnelQ');
    while(c.firstChild) c.removeChild(c.firstChild);
    c.style.animation='none';c.offsetHeight;c.style.animation='';
    var step=STEPS[fStep];
    var h2=document.createElement('h2');h2.textContent=step.q;c.appendChild(h2);
    if(step.sub){
      var sub=document.createElement('p');sub.className='vfn-sub';sub.textContent=step.sub;c.appendChild(sub);
    }

    if(step.type==='review'){
      var box=document.createElement('div');box.className='vfn-review';
      function row(k,v){
        if(!v || (Array.isArray(v) && v.length===0)) return;
        var r=document.createElement('div');r.className='vfn-review-row';
        var l=document.createElement('span');l.className='vfn-review-label';l.textContent=k;
        var val=document.createElement('span');val.className='vfn-review-value';
        val.textContent=Array.isArray(v) ? v.join(', ') : v;
        r.appendChild(l);r.appendChild(val);box.appendChild(r);
      }
      row('Service',fData.serviceType);
      row('Property',fData.propertyType);
      if(fData.serviceType==='New Installation'){
        if(fData.rooms && fData.rooms.length){
          // One row per area, showing its devices
          fData.rooms.forEach(function(r){
            row(r.name, r.sensors.join(', '));
          });
        }
        row('Monitoring',fData.monitoring);
        row('Communication',fData.communication);
      } else if(fData.serviceType==='Service & Maintenance'){
        row('Manufacturer',fData.make);
        row('Connection',fData.connection);
        row('Devices',fData.deviceCount);
      }
      c.appendChild(box);
    } else if(step.type==='contact'){
      var form=document.createElement('div');form.className='vfn-form';
      var fields=[
        {id:'cName',label:'Full name',type:'text',ph:'Jane Doe',auto:'name'},
        {id:'cEmail',label:'Email address',type:'email',ph:'jane@example.com',auto:'email'},
        {id:'cPhone',label:'Phone number',type:'tel',ph:'07700 900000',auto:'tel'}
      ];
      fields.forEach(function(f){
        var lbl=document.createElement('div');lbl.className='vfn-form-label';lbl.textContent=f.label;
        form.appendChild(lbl);
        var inp=document.createElement('input');
        inp.type=f.type;inp.id=f.id;inp.className='vfn-input';inp.placeholder=f.ph;
        inp.autocomplete=f.auto;inp.value=fData[f.id]||'';
        form.appendChild(inp);
      });
      c.appendChild(form);
      var tr=document.createElement('div');tr.className='vfn-trust';
      var trIc=document.createElement('i');trIc.className='fas fa-lock';
      tr.appendChild(trIc);
      var trT=document.createElement('span');
      var strong=document.createElement('strong');strong.textContent='Your details are secure.';
      trT.appendChild(strong);
      trT.appendChild(document.createTextNode(' We never share your information. UK GDPR compliant.'));
      tr.appendChild(trT);
      c.appendChild(tr);
    } else if(step.type==='rooms'){
      renderRoomsStep(c,step);
    } else if(step.input){
      var wrap=document.createElement('div');wrap.className='vfn-input-group';
      var inp=document.createElement('input');
      inp.type=step.input.type;inp.className='vfn-input';inp.placeholder=step.input.ph;
      inp.autocomplete=step.input.auto||'';
      inp.value=fData[step.key]||'';
      inp.id='vfnInput_'+step.key;
      inp.addEventListener('input',function(){fData[step.key]=inp.value.trim();updateButtons();});
      inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();advance();}});
      wrap.appendChild(inp);
      c.appendChild(wrap);
      setTimeout(function(){inp.focus();},150);
    } else {
      // Options list (single or multi select)
      var opts=step.opts || (step.optsByKind ? step.optsByKind[fData.propertyType] || step.optsByKind.Residential : []);
      var box=document.createElement('div');
      box.className='vfn-opts'+(opts.length>=6 ? ' two-col' : '');
      opts.forEach(function(o){box.appendChild(createPillOption(o.v,o.i,step.key,fData[step.key],step.multi));});
      c.appendChild(box);
      if(step.multi){
        var hint=document.createElement('p');hint.className='vfn-sub';hint.style.marginTop='18px';hint.style.fontSize='13.5px';
        hint.textContent='Tap any option to select. Selected options turn black. When done, press Continue.';
        c.appendChild(hint);
      }
    }
    updatePhases();
    updateButtons();
  }

  function validate(){
    var step=STEPS[fStep];
    if(step.type==='contact'){
      var n=qs('#cName').value.trim();
      var e=qs('#cEmail').value.trim();
      var p=qs('#cPhone').value.trim();
      if(!n||!e||!p){showError('Please fill in all three fields.');return false;}
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)){showError('Please enter a valid email address.');return false;}
      if(p.replace(/\D/g,'').length<7){showError('Please enter a valid phone number.');return false;}
      fData.name=n;fData.email=e;fData.phone=p;
      return true;
    }
    if(step.type==='review') return true;
    if(step.type==='rooms'){
      if(!fData.rooms || fData.rooms.length===0){showError('Please add at least one area (click a room, pick its devices, then Add to system).');return false;}
      if(stagingIdx!==null){showError('Finish or close the current area before continuing.');return false;}
      return true;
    }
    if(step.input){
      if(!fData[step.key]){showError('Please enter your '+(step.key==='postcode'?'postcode':'answer')+'.');return false;}
      if(step.key==='postcode' && !/^[A-Z]{1,2}[0-9][A-Z0-9]?\s*[0-9][A-Z]{2}$/i.test(fData[step.key])){
        showError('Please enter a valid UK postcode.');return false;
      }
      return true;
    }
    if(step.multi){
      if(!fData[step.key] || !fData[step.key].length){showError('Please select at least one option.');return false;}
      return true;
    }
    if(!fData[step.key]){showError('Please choose an option to continue.');return false;}
    return true;
  }

  function stepIsActive(idx){
    var s=STEPS[idx];
    return !s.onlyIf || s.onlyIf(fData);
  }

  function nextActiveStep(from){
    for(var i=from+1;i<STEPS.length;i++){if(stepIsActive(i)) return i;}
    return -1;
  }

  function prevActiveStep(from){
    for(var i=from-1;i>=0;i--){if(stepIsActive(i)) return i;}
    return -1;
  }

  function advance(){
    if(!validate()) return;
    var next=nextActiveStep(fStep);
    if(next===-1){success();scrollTop();return;}
    fStep=next;render();scrollTop();
  }

  function back(){
    var prev=prevActiveStep(fStep);
    if(prev>=0){fStep=prev;render();scrollTop();}
  }

  function success(){
    var card=qs('#funnelCard');
    while(card.firstChild) card.removeChild(card.firstChild);
    if(timerInt){clearInterval(timerInt);timerInt=null;}
    var wrap=document.createElement('div');wrap.className='vfn-success';
    var icon=document.createElement('div');icon.className='vfn-success-icon';
    var ch=document.createElement('i');ch.className='fas fa-check';icon.appendChild(ch);
    wrap.appendChild(icon);
    var h=document.createElement('h2');
    var firstName=(fData.name||'there').split(' ')[0];
    h.textContent='Thank you, '+firstName+'!';
    wrap.appendChild(h);
    var p=document.createElement('p');
    p.textContent='Your request has been received. A Securex security expert will call you at '+(fData.phone||'your number')+' within 24 hours to confirm your requirements and provide your free, no-obligation quote.';
    wrap.appendChild(p);
    var next=document.createElement('div');next.className='vfn-success-next';
    var nt=document.createElement('div');nt.className='vfn-success-next-title';nt.textContent='What happens next';
    next.appendChild(nt);
    var items=[
      {i:'fa-envelope',t:'Confirmation email sent to '+(fData.email||'your inbox')},
      {i:'fa-phone',t:'Expert call within 24 hours'},
      {i:'fa-file-invoice',t:'Free, no-obligation written quote'}
    ];
    items.forEach(function(s){
      var r=document.createElement('div');r.className='vfn-success-next-item';
      var ic=document.createElement('i');ic.className='fas '+s.i;
      var sp=document.createElement('span');sp.textContent=s.t;
      r.appendChild(ic);r.appendChild(sp);next.appendChild(r);
    });
    wrap.appendChild(next);
    card.appendChild(wrap);
  }

  qs('#funnelNext').addEventListener('click',advance);
  qs('#funnelBack').addEventListener('click',back);

  // Start timer + initial render
  timerInt=setInterval(tick,500);
  render();
})();

// Scroll animations
var obs=new IntersectionObserver(function(entries){
  entries.forEach(function(e){if(e.isIntersecting) e.target.classList.add('visible')});
},{threshold:0.1});
document.querySelectorAll('.service-icon-item,.trust-card,.test-card,.process-step,.svc-detail-grid,.tip-row').forEach(function(el){
  el.classList.add('animate-in');obs.observe(el);
});

// Sticky nav shadow
window.addEventListener('scroll',function(){
  document.querySelector('.navbar').classList.toggle('scrolled',window.scrollY>10);
});

// ============================================================
// Mobile polish for funnel form — brand colours, pill width,
// keep WhatsApp button from overlapping the CTA.
// Injected as a <style> block once at startup; harmless on desktop.
// ============================================================
(function(){
  if (document.getElementById('smx-funnel-mobile-css')) return;
  var css = '' +
    /* Mobile-first overrides — only apply <=900px */
    '@media (max-width: 900px){' +
      /* Make the pill option visually branded (dark navy with white text) */
      '#funnelCard .vfn-opt{' +
        'background:#0F1A2E !important;' +
        'border:2px solid #0F1A2E !important;' +
        'color:#fff !important;' +
        'box-shadow:0 4px 10px rgba(15,26,46,0.18) !important;' +
        'border-radius:14px !important;' +
        'padding:14px 18px !important;' +
        'min-height:60px !important;' +
        'gap:14px !important;' +
      '}' +
      '#funnelCard .vfn-opt:hover,#funnelCard .vfn-opt:active{' +
        'background:#1A2746 !important;' +
        'border-color:#1A2746 !important;' +
      '}' +
      /* Icon bubble inside the pill — light circle for contrast */
      '#funnelCard .vfn-opt .vfn-opt-icon{' +
        'background:rgba(255,255,255,0.12) !important;' +
        'color:#fff !important;' +
        'flex:0 0 38px !important;' +
        'width:38px !important; height:38px !important;' +
      '}' +
      '#funnelCard .vfn-opt .vfn-opt-icon i{color:#fff !important;}' +
      /* Label: single line, no wrap, ellipsis if absolutely necessary */
      '#funnelCard .vfn-opt .vfn-opt-label{' +
        'color:#fff !important;' +
        'font-weight:600 !important;' +
        'font-size:15px !important;' +
        'line-height:1.25 !important;' +
        'white-space:normal !important;' +
        'flex:1 1 auto !important;' +
        'text-align:left !important;' +
        'width:auto !important;' +
        'max-width:none !important;' +
      '}' +
      /* Arrow: tone-on-tone white */
      '#funnelCard .vfn-opt .vfn-opt-arrow{color:rgba(255,255,255,0.7) !important;}' +
      /* Chip (device picker) — keep light but readable */
      '#funnelCard .vfn-chip{font-size:14px !important; padding:8px 14px !important;}' +
      '#funnelCard .vfn-chip.is-on, #funnelCard .vfn-chip.active{' +
        'background:#0F1A2E !important; color:#fff !important; border-color:#0F1A2E !important;' +
      '}' +
      /* Continue button — make brand */
      '#funnelCard .vfn-btn-next:not([style*="hidden"]){' +
        'background:#0F1A2E !important; color:#fff !important; border:0 !important;' +
        'padding:14px 22px !important; font-weight:700 !important;' +
      '}' +
      /* Tighter phases row so all 5 fit comfortably */
      '#funnelCard .vfn-phases{font-size:13px !important;}' +
      '#funnelCard .vfn-phase{padding:6px 4px !important;}' +
      /* Push the funnel card bottom edge away from the floating WhatsApp button */
      '.funnel-card, #funnelCard{padding-bottom:32px !important;}' +
      /* Move WhatsApp widget up so it sits BELOW the form CTA, not over it. */
      '#nta-whatsapp-floating-widget,' +
      '.nta-floating-whatsapp,' +
      '[class*="whatsapp-floating"],' +
      '[id*="whatsapp-float"]{' +
        'bottom:88px !important;' +     /* lift above any CTA pill */
        'z-index:50 !important;' +
      '}' +
      '#scroll-to-top, [class*="back-to-top"], [class*="scroll-top"]{' +
        'bottom:32px !important;' +
        'z-index:49 !important;' +
      '}' +
    '}';

  var st = document.createElement('style');
  st.id = 'smx-funnel-mobile-css';
  st.textContent = css;
  document.head.appendChild(st);
})();
