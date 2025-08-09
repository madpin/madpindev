(function(){
// Simplified ADHD assessment demo without webcam or movement tracking
let stimulus,testActive=false,testPaused=false,responses=[],stimuli=[],startTime,testDuration,stimulusDuration,progressInterval,stimulusInterval,testTimeout,previousStimulus=null;
const startScreen=document.getElementById('startScreen'),testScreen=document.getElementById('testScreen'),resultsScreen=document.getElementById('resultsScreen');
const startBtn=document.getElementById('startBtn'),demoBtn=document.getElementById('demoBtn'),pauseBtn=document.getElementById('pauseBtn'),stopBtn=document.getElementById('stopBtn'),restartBtn=document.getElementById('restartBtn'),exportBtn=document.getElementById('exportBtn');
const progressBar=document.getElementById('progressBar'),durationInput=document.getElementById('testDuration'),durationDisplay=document.getElementById('durationDisplay'),stimulusDurationSelect=document.getElementById('stimulusDuration');

if(!startBtn) return; // safety if page not fully loaded

durationInput.addEventListener('input',()=>durationDisplay.textContent=durationInput.value);
startBtn.addEventListener('click',()=>{testDuration=parseInt(durationInput.value)*60*1000;stimulusDuration=parseFloat(stimulusDurationSelect.value)*1000;startScreen.classList.remove('active');testScreen.classList.add('active');initTest();});
demoBtn.addEventListener('click',()=>{startScreen.classList.remove('active');resultsScreen.classList.add('active');generateDemoResults();});
pauseBtn.addEventListener('click',()=>{testPaused=!testPaused;pauseBtn.textContent=testPaused?'Resume Test':'Pause Test';});
stopBtn.addEventListener('click',endTest);restartBtn.addEventListener('click',()=>{resultsScreen.classList.remove('active');startScreen.classList.add('active');resetTest();});exportBtn.addEventListener('click',exportResults);

document.addEventListener('keydown',e=>{
	if(!testActive) return;
	// Finish test early on Enter
	if(e.code==='Enter') { e.preventDefault(); endTest(); return; }
	if(testPaused) return;
	if(e.code!=='Space') return;
	const responseTime=Date.now();
	const activeStimulus=stimuli.filter(s=>responseTime-s.time<=stimulusDuration).pop();
	if(activeStimulus){
		if(activeStimulus.responded){
			responses.push({time:responseTime,stimulusTime:activeStimulus.time,isTarget:activeStimulus.isTarget,correct:false});
		}else{
			responses.push({time:responseTime,stimulusTime:activeStimulus.time,isTarget:activeStimulus.isTarget,correct:activeStimulus.isTarget});
			activeStimulus.responded=true;
		}
	}else{
		responses.push({time:responseTime,stimulusTime:null,isTarget:false,correct:false});
	}
});

function initTest(){stimulus=document.getElementById('stimulus');setTimeout(startTest,300);} 
function enterFullscreenShell(){
	// In-page immersive mode (no browser fullscreen API)
	document.body.classList.add('adhd-running');
}
function exitFullscreenShell(){
	document.body.classList.remove('adhd-running');
}
function startTest(){// ensure test screen visible then enter immersive
 testScreen.classList.add('active');
 enterFullscreenShell();
 testActive=true;startTime=Date.now();previousStimulus=null;progressBar.style.width='0%';
 progressInterval=setInterval(updateProgress,120);presentStimulus();testTimeout=setTimeout(endTest,testDuration);} 
function updateProgress(){const elapsed=Date.now()-startTime;progressBar.style.width=`${Math.min(100,elapsed/testDuration*100)}%`;}
function presentStimulus(){
 if(!testActive||testPaused){stimulusInterval=setTimeout(presentStimulus,500);return;}
 const shapes=['circle','square'];
 const colors=['blue','red'];
 const shape=shapes[Math.random()<0.5?0:1];
 const color=colors[Math.random()<0.5?0:1];
 const isTarget=previousStimulus&&previousStimulus.shape===shape&&previousStimulus.color===color;
 stimulus.className=shape==='circle'?'':'square';
 stimulus.classList.add(color);
 stimulus.style.opacity='0';
 stimulus.style.display='block';
 requestAnimationFrame(()=>{stimulus.style.transition='opacity 160ms ease-out';stimulus.style.opacity='1';});
 const stimulusTime=Date.now();
 stimuli.push({time:stimulusTime,shape,color,isTarget,responded:false});
 setTimeout(()=>{
	 stimulus.style.transition='opacity 120ms ease-in';
	 stimulus.style.opacity='0';
	 setTimeout(()=>{stimulus.style.display='none';stimulus.className='';previousStimulus={shape,color};
		 // Wider variability: 400ms to 2600ms
		 const gap=400+Math.random()*2200;
		 stimulusInterval=setTimeout(presentStimulus,gap);
	 },130);
 },stimulusDuration);
} 
function endTest(){if(!testActive)return;testActive=false;testPaused=false;clearInterval(progressInterval);clearTimeout(stimulusInterval);clearTimeout(testTimeout);exitFullscreenShell();stimulus.style.display='none';testScreen.classList.remove('active');resultsScreen.classList.add('active');analyzeResults();}
function analyzeResults(){const targetStimuli=stimuli.filter(s=>s.isTarget);const omissionErrors=targetStimuli.length-responses.filter(r=>r.isTarget&&r.correct).length;const commissionErrors=responses.filter(r=>!r.isTarget&&!r.correct).length;const totalResponses=responses.length;const correctResponses=responses.filter(r=>r.correct).length;const accuracy=totalResponses?correctResponses/totalResponses*100:0;const reactionTimes=responses.filter(r=>r.isTarget&&r.correct&&r.stimulusTime).map(r=>r.time-r.stimulusTime).filter(rt=>rt>=0&&rt<=stimulusDuration);const avgRT=reactionTimes.length?reactionTimes.reduce((a,b)=>a+b,0)/reactionTimes.length:0;let rtVar=0;if(reactionTimes.length>1){const mean=avgRT;rtVar=Math.sqrt(reactionTimes.reduce((s,rt)=>s+Math.pow(rt-mean,2),0)/(reactionTimes.length-1));}
setText('omissionErrors',omissionErrors);setText('commissionErrors',commissionErrors);setText('avgReactionTime',reactionTimes.length?Math.round(avgRT)+'ms':'N/A');setText('rtVariability',reactionTimes.length>1?Math.round(rtVar)+'ms':'N/A');setText('accuracy',accuracy.toFixed(1)+'%');}
function generateDemoResults(){responses=[{time:1000,stimulusTime:900,isTarget:true,correct:true},{time:2500,stimulusTime:2400,isTarget:true,correct:true},{time:3200,stimulusTime:null,isTarget:false,correct:false},{time:4100,stimulusTime:4000,isTarget:false,correct:false},{time:5500,stimulusTime:5400,isTarget:true,correct:true},{time:7000,stimulusTime:6900,isTarget:true,correct:true},{time:8300,stimulusTime:null,isTarget:false,correct:false},{time:9600,stimulusTime:9500,isTarget:false,correct:false}];stimuli=[{time:900,shape:'circle',color:'blue',isTarget:true},{time:2400,shape:'circle',color:'blue',isTarget:true},{time:4000,shape:'square',color:'red',isTarget:false},{time:5400,shape:'circle',color:'blue',isTarget:true},{time:6900,shape:'circle',color:'blue',isTarget:true},{time:9500,shape:'square',color:'red',isTarget:false}];analyzeResults();}
function exportResults(){const results={testInfo:{duration:testDuration/6e4||0,stimulusDuration:stimulusDuration/1e3||0,timestamp:new Date().toISOString()},metrics:{omissionErrors:gt('omissionErrors'),commissionErrors:gt('commissionErrors'),avgReactionTime:gt('avgReactionTime'),rtVariability:gt('rtVariability'),accuracy:gt('accuracy')},rawData:{stimuli,responses}};const blob=new Blob([JSON.stringify(results,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`adhd-assessment-${new Date().toISOString().slice(0,19)}.json`;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);} 
function resetTest(){exitFullscreenShell();testActive=false;testPaused=false;responses=[];stimuli=[];previousStimulus=null;progressBar.style.width='0%';clearInterval(progressInterval);clearTimeout(stimulusInterval);clearTimeout(testTimeout);} 
function setText(id,val){const el=document.getElementById(id);if(el)el.textContent=val;}function gt(id){const el=document.getElementById(id);return el?el.textContent:"";} 
})();
