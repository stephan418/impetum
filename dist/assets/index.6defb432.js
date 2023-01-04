var Ve=Object.defineProperty,Ke=Object.defineProperties;var Je=Object.getOwnPropertyDescriptors;var Pe=Object.getOwnPropertySymbols;var et=Object.prototype.hasOwnProperty,tt=Object.prototype.propertyIsEnumerable;var xe=(o,e,t)=>e in o?Ve(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t,he=(o,e)=>{for(var t in e||(e={}))et.call(e,t)&&xe(o,t,e[t]);if(Pe)for(var t of Pe(e))tt.call(e,t)&&xe(o,t,e[t]);return o},Se=(o,e)=>Ke(o,Je(e));import{M as Oe,P as it,a as st,S as ze,B as S,V as u,b as h,Q as v,C as de,G as ot,T as rt,r as y,s as w,$ as g,n as M,e as p,l as W,c as G,E as m,R as ge,d as nt,f as x,g as at,h as E,i as ht,W as lt,j as dt,k as Ce,m as ct,o as ut,p as pt,q as le,t as gt,u as mt,A as ft,D as vt,v as Te,w as yt,x as wt,y as Mt,z as ke}from"./vendor.08434713.js";const bt=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerpolicy&&(r.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?r.credentials="include":s.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}};bt();class De extends Error{constructor(e){super(e)}}class Et{constructor(e){this.pressedKeys=new Map,this.keysCallbacks=new Map,this.scrollCallbacks=[],this.pressedMouseButtons=new Map,this.mouseCallbacks=new Map,this.lockControls=e;const t=document.querySelector("canvas#view");if(!t)throw new Error("Root canvas could not be found");this.mouseRoot=t,document.body.oncontextmenu=()=>!1,document.addEventListener("keydown",this.onKeyDown.bind(this)),document.addEventListener("keyup",this.onKeyUp.bind(this)),this.mouseRoot.addEventListener("mousedown",this.onMouseDown.bind(this)),this.mouseRoot.addEventListener("mouseup",this.onMouseUp.bind(this)),document.addEventListener("wheel",this.onScroll.bind(this))}onKeyDown(e){var i;let t=e.key;t=t.toLowerCase(),this.pressedKeys.set(t,!0),!(this.keysCallbacks.get(t)==null||e.repeat)&&((i=this.keysCallbacks.get(t))==null||i(!0))}onKeyUp(e){var i;let t=e.key;t=t.toLowerCase(),this.pressedKeys.set(t,!1),!(this.keysCallbacks.get(t)==null||e.repeat)&&((i=this.keysCallbacks.get(t))==null||i(!1))}onScroll(e){const t=e.deltaMode===0?{deltaY:e.deltaY,deltaX:e.deltaX,deltaZ:e.deltaZ}:{};e.deltaY>=0?t.direction="down":t.direction="up";for(const i of this.scrollCallbacks)i(t)}isPressed(e){return this.pressedKeys.get(e)!=null?this.pressedKeys.get(e):!1}addKeyCallback(e,t){this.keysCallbacks.set(e,t)}removeKeyCallback(e){this.keysCallbacks.get(e)!=null&&this.keysCallbacks.delete(e)}onMouseDown(e){var t;if(!this.lockControls||this.lockControls.isLocked){if(this.pressedMouseButtons.set(e.which,!0),this.mouseCallbacks.get(e.which)==null)return;(t=this.mouseCallbacks.get(e.which))==null||t.forEach(i=>i(!0))}}onMouseUp(e){var t;if(!this.lockControls||this.lockControls.isLocked){if(this.pressedMouseButtons.set(e.which,!1),this.mouseCallbacks.get(e.which)==null)return;(t=this.mouseCallbacks.get(e.which))==null||t.forEach(i=>i(!1))}}isClicked(e){return this.pressedMouseButtons.get(e)!=null?this.pressedMouseButtons.get(e):!1}addMouseButtonCallback(e,t){const i=this.mouseCallbacks.get(e)||[];this.mouseCallbacks.set(e,[...i,t])}addScrollCallback(e){this.scrollCallbacks.push(e)}removeScrollCallback(e){const t=this.scrollCallbacks.findIndex(i=>i===e);return t<0?!1:(this.scrollCallbacks.splice(t,1),!0)}set pointerLockControls(e){this.lockControls=e}}const f={keys:{setFullscreen:"f",movementForward:"w",movementBackward:"s",movementLeft:"a",movementRight:"d",jump:" "},graphics:{shadows:!0,shadowsize:1024},game:{creativeMode:!1},building:{ghostTimeDelay:.02},hud:{hudScale:1},inventory:{hotbarSlots:9,backSlots:36}},I=new Oe("ground"),_=new Oe("slippery");class Pt{constructor(e=1,t=80,i=.1,s=1e3,r,n,a,l,c){this.buildingGhostClock=void 0,this.scene=l,this.howMuchRight=0,this.howMuchBack=0,this.ghostSelectedItem=void 0,this.ghostSelectedItemPrevious=void 0,this.ghostBuildingElement=void 0,this.moveVelocity=1900,this.jumpVelocity=180,this.canJump=!1,this.buildingManager=n,this.resourceManager=a,this.camera=new it(t,e,i,s),this.pointerLockControls=new st(this.camera,c!=null?c:document.body),this.addPointerLockOnClick(document.body),this.inputManager=r,this.colliderRadius=1.3,this.cShape=new ze(this.colliderRadius),this.cBody=new S({mass:1e3,material:_}),this.cBody.position.set(0,10,50);for(let d=0;d<6;d++)this.cBody.addShape(this.cShape,new u(0,d,0));this.cBody.fixedRotation=!0,this.cBody.updateMassProperties(),this.lookDirectionEmptyVector=new h,this.cBody.addEventListener("collide",d=>{d.contact.ni.dot(new u(0,1,0))<-.4&&(this.canJump=!0)}),this.inputManager.addKeyCallback(f.keys.jump,()=>{this.canJump==!0&&(this.cBody.velocity.y+=this.jumpVelocity,this.canJump=!1)}),window.interactionManager.addEventListener({type:"left"},d=>{try{this.buildingManager.removeGridElement(this.buildingManager.objectIdToElement(d.id))}catch{}}),this.inputManager.addMouseButtonCallback(3,d=>{if(d==!0&&this.inventory.selected!=null&&this.inventory.selected.item.buildingElement!=null){let b=new this.inventory.selected.item.buildingElement(this.resourceManager);this.buildingManager.addGridElement(b);let P=this.buildingManager.shotRayCastGetBuildingElementPosition(b,this.camera.position,this.camera.getWorldDirection(this.lookDirectionEmptyVector),0,50);P.position==null||n.isGridElementAtPositionAlready(P.position)?this.buildingManager.removeGridElement(b):(b.setPosition(P.position||new h(0,0,0)),b.setQuaternion(P.rotation||new v(0,0,0))),f.game.creativeMode!=!0&&this.inventory.retrieveFromIndex(1,this.inventory.selectedIdx)}}),this.lookDirection=new h,this.inventory=window.storageManager.getOrInitInventory(f.inventory.hotbarSlots,f.inventory.backSlots,r)}addPointerLockOnClick(e){e.onclick=()=>{this.pointerLockControls.lock()}}addToWorld(e){e.cScene.addBody(this.cBody)}removeFromWorld(e){e.cScene.removeBody(this.cBody)}movePlayer(e,t,i){this.lookDirection.x=e,this.lookDirection.y=t,this.lookDirection.z=i,this.lookDirection.applyQuaternion(this.camera.quaternion),e==0&&i==0?this.cBody.velocity.set(this.cBody.velocity.x*.95,this.cBody.velocity.y,this.cBody.velocity.z*.95):(this.cBody.velocity.x=this.lookDirection.x*.02,this.cBody.velocity.z=this.lookDirection.z*.02),this.cBody.wakeUp()}update(e){if(this.howMuchBack=0,this.howMuchRight=0,this.inputManager.isPressed(f.keys.movementForward)?this.howMuchBack=-this.moveVelocity:this.inputManager.isPressed(f.keys.movementBackward)&&(this.howMuchBack=this.moveVelocity),this.inputManager.isPressed(f.keys.movementLeft)?this.howMuchRight=-this.moveVelocity:this.inputManager.isPressed(f.keys.movementRight)&&(this.howMuchRight=this.moveVelocity),this.movePlayer(this.howMuchRight,0,this.howMuchBack),this.camera.position.copy(this.cBody.position),this.camera.position.y+=6,this.cBody.velocity.y>40&&this.cBody.velocity.set(this.cBody.velocity.x,40,this.cBody.velocity.z),this.buildingGhostClock!=null&&this.buildingGhostClock.getElapsedTime()>f.building.ghostTimeDelay){if(this.inventory.selected!=null){this.ghostSelectedItem=this.inventory.selected.item||void 0,this.ghostSelectedItem!=this.ghostSelectedItemPrevious&&(this.ghostBuildingElement!=null&&this.buildingManager.removeGhostElement(this.ghostBuildingElement),this.ghostBuildingElement=new this.inventory.selected.item.buildingElement(this.resourceManager),this.buildingManager.addGhostElement(this.ghostBuildingElement));let t=this.buildingManager.shotRayCastGetBuildingElementPosition(this.ghostBuildingElement,this.camera.position,this.camera.getWorldDirection(this.lookDirectionEmptyVector),0,50);this.ghostBuildingElement.setPosition(t.position||new h(-100,-100,-100)),this.ghostBuildingElement.setQuaternion(t.rotation||new v)}else this.ghostBuildingElement&&this.buildingManager.removeGhostElement(this.ghostBuildingElement);this.buildingGhostClock.start()}}startGhostClock(){this.buildingGhostClock=new de,this.buildingGhostClock.start()}updatePhysics(e){}}class xt{constructor(){this.gltfLoader=new ot}async loadGLTFGeometryAsync(e){try{return(await this.gltfLoader.loadAsync(e)).scene.children}catch{return}}}class St{constructor(e){this.loadingManager=e,this.modelGeometries=new Map,this.modelMaterials=new Map,this.modelTextures=new Map,this.modelShapes=new Map,this.loadingModelQueue=0,this.finishedModelLoadingCallback=()=>{},this.textureLoader=new rt}loadModelGeometry(e,t,i){this.modelGeometries.get(e)==null&&(this.loadingModelQueue++,this.loadingManager.loadGLTFGeometryAsync(t).then(s=>{s!=null&&(this.addModelGeometry(e,s[i||0].geometry,i||0),this.loadingModelQueue--,this.loadingModelQueue==0&&this.finishedModelLoadingCallback())}))}loadModelGeometries(e,t){this.modelGeometries.get(e)==null&&(this.loadingModelQueue++,this.loadingManager.loadGLTFGeometryAsync(t).then(i=>{i!=null&&(i.forEach((s,r)=>{this.addModelGeometry(e,s.geometry,r)}),this.loadingModelQueue--,this.loadingModelQueue==0&&this.finishedModelLoadingCallback())}))}setFinishedModelLoadingCallback(e){this.finishedModelLoadingCallback=e}addModelGeometry(e,t,i){let s=this.modelGeometries.get(e);s==null&&(this.modelGeometries.set(e,[]),s=this.modelGeometries.get(e)),s[i||0]=t,this.modelGeometries.set(e,s||[])}getModelGeometry(e,t){let i=this.modelGeometries.get(e);if(i!=null)return i[t||0]}addModelMaterial(e,t,i){let s=this.modelMaterials.get(e);s==null&&(this.modelMaterials.set(e,[]),s=this.modelMaterials.get(e)),s[i||0]=t,this.modelMaterials.set(e,s||[])}getModelMaterial(e,t){let i=this.modelMaterials.get(e);if(i!=null)return i[t||0]}loadModelTexture(e,t,i){this.addModelTexture(e,this.textureLoader.load(t),i||0)}addModelTexture(e,t,i){let s=this.modelTextures.get(e);s==null&&(this.modelTextures.set(e,[]),s=this.modelTextures.get(e)),s[i||0]=t,this.modelTextures.set(e,s||[])}getModelTexture(e,t){let i=this.modelTextures.get(e);if(i!=null)return i[t||0]}addModelShape(e,t,i,s,r){let n=this.modelShapes.get(e);n==null&&(n=[]),n[s||0]==null&&(n[s||0]=[]),n[s||0][r||0]={shape:t,offset:i},this.modelShapes.set(e,n)}getModelShape(e,t,i){let s=this.modelShapes.get(e);return s==null?{shape:void 0,offset:void 0}:s[t||0]==null?{shape:void 0,offset:void 0}:{shape:s[t||0][i||0].shape,offset:s[t||0][i||0].offset}}getModelShapes(e,t){let i=this.modelShapes.get(e);return i==null?[]:i[t||0]}}var Ct=Object.defineProperty,Tt=Object.getOwnPropertyDescriptor,kt=(o,e,t,i)=>{for(var s=i>1?void 0:i?Tt(e,t):e,r=o.length-1,n;r>=0;r--)(n=o[r])&&(s=(i?n(e,t,s):n(s))||s);return i&&s&&Ct(e,t,s),s};let Q=class extends w{render(){return g`<span id="horizontal"></span> <span id="vertical"></span>`}};Q.styles=y`
    :host {
      display: block;
      width: 10px;
      height: 10px;
      position: absolute;
    }

    span {
      background: #ddd;
      position: absolute;
      overflow: hidde;
    }

    #vertical {
      height: 10px;
      width: 2px;
      left: 50%;
      top: calc(50% - 4px);
    }

    #horizontal {
      height: 2px;
      width: 10px;
      left: calc(50% - 4px);
      top: 50%;
    }
  `;Q=kt([M("i-crosshair")],Q);var It=Object.defineProperty,_t=Object.getOwnPropertyDescriptor,Fe=(o,e,t,i)=>{for(var s=i>1?void 0:i?_t(e,t):e,r=o.length-1,n;r>=0;r--)(n=o[r])&&(s=(i?n(e,t,s):n(s))||s);return i&&s&&It(e,t,s),s};let $=class extends w{handleClose(){this.dispatchEvent(new CustomEvent("close"))}render(){var o;return g`
      ${(o=this.message)!=null?o:"Info"}
      <button @click=${this.handleClose}>Close</button>
    `}};$.styles=y`
    :host {
      width: fit-content;
      height: fit-content;
      padding: 20px;

      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      gap: 10px;

      background: #bbbbbb;
    }
  `;Fe([p({type:String})],$.prototype,"message",2);$=Fe([M("i-info-box")],$);class j extends Error{constructor(e,t){super(e!=null?e:"DeserializationError");this.origin=t,Object.setPrototypeOf(this,new.target.prototype),this.name=this.constructor.name}}function ie(o){try{return o()}catch(e){throw e instanceof SyntaxError?new j(e.message,e):e}}function Bt(o){return typeof o=="object"&&typeof o.id=="string"}class q{static fromSerialized(e){const t=ie(()=>JSON.parse(e));if(!Bt(t))throw new j("Not an item");const i=window.itemTypeRegistry.getItem(t.id);return i?new i:!1}serialize(){return JSON.stringify({id:this.id})}toSerializable(){return{id:this.id,class:!0}}}var Lt=Object.defineProperty,Ot=Object.getOwnPropertyDescriptor,me=(o,e,t,i)=>{for(var s=i>1?void 0:i?Ot(e,t):e,r=o.length-1,n;r>=0;r--)(n=o[r])&&(s=(i?n(e,t,s):n(s))||s);return i&&s&&Lt(e,t,s),s};let L=class extends w{render(){return this.selected!==void 0&&this.classList.add("selected"),this.group?this.group.item instanceof q?g`<img src=${this.group.item.icon} /><span>${this.group.amount}</span>`:g`<div>${this.group.item.id}</div>
      <span>${this.group.amount}</span>`:g``}};L.styles=y`
    :host {
      display: flex;
      position: relative;
      border: 2.5px solid #777777;

      height: 50px;
      width: 50px;

      box-sizing: border-box;
    }

    :host([selected]) {
      border: 4px solid #444444;
    }

    img,
    div {
      height: 80%;
      width: 80%;

      position: absolute;
      top: 50%;
      left: 50%;

      transform: translate(-50%, -50%);
    }

    span {
      font-family: sans-serif;
      position: absolute;
      bottom: 5%;
      right: 5%;

      font-size: 0.8rem;
    }
  `;me([p()],L.prototype,"group",2);me([p()],L.prototype,"selected",2);L=me([M("i-inventory-slot")],L);class B extends Error{constructor(e){super(e!=null?e:"ValueError");Object.setPrototypeOf(this,new.target.prototype),this.name=this.constructor.name}}class ce extends Error{constructor(e){super(e)}}function Ge(o){if(o!==null){if(Array.isArray(o))return o.map(e=>Ge(e));if(typeof o=="object"){const e={};for(const t of Object.keys(o)){let i=o[t];i===null&&(i=void 0),e[t]=i}return e}}}function zt(o){return typeof o=="undefined"||typeof o=="object"&&typeof o.item=="object"&&typeof o.item.id=="string"&&typeof o.amount=="number"}function Dt(o){return Array.isArray(o)&&o.every(e=>zt(e))}class se{constructor(e,t){this.slots=Array(e).fill(void 0),t&&(this.slots=t)}open(){return this.slots}retrieve(e,t){let i=1,s=t;for(;i;)if(i=this.find(e),i){const r=this.slots[i];if(!r)return null;if(s-=r.amount,s>=0&&this.slots.splice(i,1),s<=0)return r.amount-=t,{item:r.item,amount:t}}return null}setIndex(e,t){this.slots[e]=t}getIndex(e){return this.slots[e]}retrieveIndex(e,t){const i=this.getIndex(e);i&&(i.amount-=t||i.amount,i.amount<=0&&this.setIndex(e,void 0))}store(e,t){const i=this.find(e.id);if(i<0)this.slots[this.findFirstEmptySlot()]={item:e,amount:t};else{const s=this.slots[i];if(!s)return;s.amount+=t}}storeAtSlot(e,t,i){const s=this.slots[i];if(s)if(s.item.id===e.id)s.amount+=t;else throw new ce(`Cannot add item(s) to slot ${i}, incompatible content`);else{const r={item:e,amount:t};this.slots[i]=r}}moveSlot(e,t,i){var s,r,n,a,l,c,d;if(e!==t)if(i&&((s=this.slots[e])==null?void 0:s.amount)&&i>=((r=this.slots[e])==null?void 0:r.amount)&&(i=void 0),this.slots[e]!==void 0&&((n=this.slots[t])==null?void 0:n.item.id)===((a=this.slots[e])==null?void 0:a.item.id))(this.slots[t]||{}).amount+=(c=i!=null?i:(l=this.slots[e])==null?void 0:l.amount)!=null?c:0,this.retrieveIndex(e,i);else if(this.slots[e]&&!this.slots[t])i?(this.slots[t]={item:(d=this.slots[e])==null?void 0:d.item,amount:i},this.slots[e].amount-=i):(this.slots[t]=this.slots[e],this.slots[e]=void 0);else throw new ce(`Cannot move slot ${e} to slot ${t}`)}static fromSerialized(e,t){const i=Ge(ie(()=>JSON.parse(e)));if(!Dt(i))throw new j("Not a valid slots object");return new se(t.slots,i.map(s=>window.itemTypeRegistry.safeSlotToObject(s)))}serialize(){return JSON.stringify(this.slots.map(e=>(e==null?void 0:e.item)instanceof q?{amount:e.amount,item:e.item.toSerializable()}:e))}find(e){return this.slots.findIndex(t=>(t==null?void 0:t.item.id)===e)}findFirstEmptySlot(){return this.slots.findIndex(e=>e===void 0)}get isFull(){return this.findFirstEmptySlot()===-1}get size(){return this.slots.length}}class Ie extends se{}class _e extends se{}class X{constructor(e){this.ownedCurrency=e!=null?e:0}static fromSerialized(e){const t=ie(()=>JSON.parse(e));if(typeof t!="number")throw new j("Cannot innit from type "+typeof t);return new X(t)}canWithdraw(e){return this.ownedCurrency>e}withdraw(e){if(!this.canWithdraw(e))throw new B("Not enough currency left");return this.ownedCurrency-=e,e}deposit(e){this.ownedCurrency+=e}serialize(){return JSON.stringify(this.ownedCurrency)}get content(){return this.ownedCurrency}}function R(o,e,t){const i=t.value;return t.value=function(...s){const r=i.apply(this,s);return this.eventManager.dispatchEvent("change"),r},t}class fe{constructor(){this.eventHandlers={}}getHandlers(e){return this.eventHandlers[e]||(this.eventHandlers[e]=[]),this.eventHandlers[e]}addEventlistener(e,t){this.getHandlers(e).push(t)}dispatchEvent(e,t){this.getHandlers(e).forEach(i=>i(e,t))}}class oe{constructor(e){this.eventHandlers=Object.assign({},...e.map(t=>({[t]:[]})))}addEventListener(e,t){this.eventHandlers[e].push(t)}removeEventListener(e,t){const i=this.eventHandlers[e],s=i.findIndex(r=>r===t);return s<0?(console.error("The handler could not be removed because it does not exist"),!1):i?Boolean(i.splice(s,1)):!1}dispatchEvent(e){this.eventHandlers[e].forEach(t=>t())}}var Ft=Object.defineProperty,Gt=Object.getOwnPropertyDescriptor,A=(o,e,t,i)=>{for(var s=i>1?void 0:i?Gt(e,t):e,r=o.length-1,n;r>=0;r--)(n=o[r])&&(s=(i?n(e,t,s):n(s))||s);return i&&s&&Ft(e,t,s),s};function Wt(o){return typeof o=="object"&&typeof o.hotbar=="string"&&typeof o.back=="string"&&typeof o.purse=="string"}const We=class{constructor(o,e,t,i){var s;this.selectedIndex=0,i?(this.hotbar=_e.fromSerialized(i.hotbar,{slots:o}),this.back=Ie.fromSerialized(i.back,{slots:e}),this.purse=X.fromSerialized(i.purse)):(this.hotbar=new _e(o),this.back=new Ie(e),this.purse=new X),this.inputManager=t,(s=this.inputManager)==null||s.addScrollCallback(this.onScroll.bind(this)),this.eventManager=new oe(["change","select"]),this.addEventListener=this.eventManager.addEventListener.bind(this.eventManager),this.removeEventListener=this.eventManager.removeEventListener.bind(this.eventManager)}onScroll(o){o.direction==="up"&&this.selectedIndex<this.hotbar.size-1?this.selectedIndex++:o.direction==="down"&&this.selectedIndex>0&&this.selectedIndex--,this.eventManager.dispatchEvent("select")}collect(o,e){this.hotbar.isFull?this.back.store(o,e):this.hotbar.store(o,e)}collectToIndex(o,e,t){if(t<this.hotbar.size)return this.hotbar.storeAtSlot(o,e,t);this.back.storeAtSlot(o,e,t-this.hotbar.size)}retrieveFromIndex(o,e){if(e<this.hotbar.size)return this.hotbar.retrieveIndex(e,o);this.back.retrieveIndex(e-this.hotbar.size,o)}moveSlot(o,e,t){if(o<this.hotbar.size&&e<this.hotbar.size)return this.hotbar.moveSlot(o,e,t);if(o>=this.hotbar.size&&e>=this.hotbar.size)return this.back.moveSlot(o-this.hotbar.size,e-this.hotbar.size,t);{let i;if(o<this.hotbar.size?i=this.hotbar.getIndex(o):i=this.back.getIndex(o-this.hotbar.size),!i)throw new ce(`Cannot move empty slot at ${o}`);t&&(i=Object.assign(Object.create(Object.getPrototypeOf(i)),i),i.amount=i.amount>t?t:i.amount),e<this.hotbar.size?this.hotbar.storeAtSlot(i.item,i.amount,e):this.back.storeAtSlot(i.item,i.amount,e-this.hotbar.size),o<this.hotbar.size?this.hotbar.retrieveIndex(o,i.amount):this.back.retrieveIndex(o-this.hotbar.size,i.amount)}}desposit(o){this.purse.deposit(o)}serialize(){return JSON.stringify({hotbar:this.hotbar.serialize(),back:this.back.serialize(),purse:this.purse.serialize()})}static fromSerialized(o,e=9,t=36,i){const s=ie(()=>JSON.parse(o));if(!Wt(s))throw new j("Cannot interpret value");return new We(e,t,i,s)}get purseContent(){return this.purse.content}getIndex(o){return o<this.hotbar.size?this.hotbar.getIndex(o):this.back.getIndex(o-this.hotbar.size)}get hotbarContent(){return this.hotbar.open()}get backContent(){return this.back.open()}get content(){return[...this.hotbarContent,...this.backContent]}get selected(){return this.getIndex(this.selectedIndex)}get selectedIdx(){return this.selectedIndex}get pursePaymentMethod(){return this.purse}};let C=We;A([R],C.prototype,"collect",1);A([R],C.prototype,"collectToIndex",1);A([R],C.prototype,"retrieveFromIndex",1);A([R],C.prototype,"moveSlot",1);A([R],C.prototype,"desposit",1);var $t=Object.defineProperty,jt=Object.getOwnPropertyDescriptor,ve=(o,e,t,i)=>{for(var s=i>1?void 0:i?jt(e,t):e,r=o.length-1,n;r>=0;r--)(n=o[r])&&(s=(i?n(e,t,s):n(s))||s);return i&&s&&$t(e,t,s),s};let O=class extends w{onInventoryChange(){}set inventory(o){o.addEventListener("change",this.onInventoryChange.bind(this)),this._inventory=o}handleNotEnoughMoney(){this.dispatchEvent(new CustomEvent("not-enough-money"))}handleSlotClick(o,e){this.dispatchEvent(new CustomEvent("slot-click",{detail:{idx:o,mouse:e.detail.mouse}}))}handleStoreBuy(o){if(this.store&&this._inventory){try{const e=this.store.buyIndex(o.detail.index,this._inventory.pursePaymentMethod);this._inventory.collect(e.item,e.amount)}catch(e){if(e instanceof B)return this.handleNotEnoughMoney()}throw o}}render(){return g`
      <div id="inventory">
        <h1>Inventory</h1>
        <i-inventory
          @slot-click=${o=>{var e;return this.handleSlotClick(o.detail.idx+((e=this._inventory)==null?void 0:e.hotbarContent.length),o)}}
          .inventory=${this._inventory}></i-inventory>
      </div>
      <div id="store">
        <h1>Store</h1>
        <i-store @store-buy=${this.handleStoreBuy} .store=${this.store}></i-store>
      </div>
    `}};O.styles=y`
    :host {
      position: absolute;

      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      display: grid;
      grid: 1fr / 1fr 1fr;

      background: #cccccccc;
      height: clamp(400px, 70vh, 700px);
      width: clamp(500px, 80vw, 800px);
    }

    :host::before {
      content: "";
      position: absolute;
      background: #777777;
      width: 2px;
      height: 70%;

      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    :host > div {
      display: grid;

      grid: 20% 1fr / 1fr;
      justify-items: center;

      height: 100%;

      overflow: auto;
    }

    #inventory {
      overflow: hidden;
    }

    :host > div > div {
      margin-bottom: 10%;
      width: 90%;
    }
  `;ve([p({type:C})],O.prototype,"inventory",1);ve([p()],O.prototype,"store",2);O=ve([M("i-inventory-overlay")],O);const $e=(o,e)=>{let t;if(o.button===0)t="left";else if(o.button===2)t="right";else return;return new CustomEvent("slot-click",{detail:{idx:e,mouse:{pageY:o.pageY,pageX:o.pageX,button:t}}})};var qt=Object.defineProperty,Rt=Object.getOwnPropertyDescriptor,ye=(o,e,t,i)=>{for(var s=i>1?void 0:i?Rt(e,t):e,r=o.length-1,n;r>=0;r--)(n=o[r])&&(s=(i?n(e,t,s):n(s))||s);return i&&s&&qt(e,t,s),s};const{hud:{hudScale:At}}=f;let z=class extends w{constructor(){super(...arguments);this.size=9}connectedCallback(){var o,e;super.connectedCallback(),(o=this.inventory)==null||o.addEventListener("change",async()=>{await this.requestUpdate()}),(e=this.inventory)==null||e.addEventListener("select",async()=>{await this.requestUpdate()})}handleSlotClick(o,e){e.stopPropagation(),e.preventDefault();const t=$e(e,o);if(!!t)return this.dispatchEvent(t),!1}render(){var o;return g`
      ${(o=this.inventory)==null?void 0:o.hotbarContent.map((e,t)=>{var i;return g`<i-inventory-slot
          @click=${s=>this.handleSlotClick(t,s)}
          @contextmenu=${s=>this.handleSlotClick(t,s)}
          .group=${e?{item:e==null?void 0:e.item,amount:e.amount}:void 0}
          ?selected=${((i=this.inventory)==null?void 0:i.selectedIdx)===t}></i-inventory-slot>`})}
    `}};z.styles=y`
    :host {
      display: flex;
      position: absolute;

      height: max-content;
      width: max-content;
      background: #cccccccc;

      gap: calc(5px * ${At});
      padding: 5px;
    }
  `;ye([p({attribute:"size",type:Number})],z.prototype,"size",2);ye([p()],z.prototype,"inventory",2);z=ye([M("i-item-bar")],z);var Nt=Object.defineProperty,Ht=Object.getOwnPropertyDescriptor,Qt=(o,e,t,i)=>{for(var s=i>1?void 0:i?Ht(e,t):e,r=o.length-1,n;r>=0;r--)(n=o[r])&&(s=(i?n(e,t,s):n(s))||s);return i&&s&&Nt(e,t,s),s};let U=class extends w{handleUnpauseClick(){const o=new CustomEvent("unpause");this.dispatchEvent(o)}render(){return g`
      <div @click=${this.onInnerClick} class="content">
        <h1>Game paused</h1>
        <div id="options">
          <button @click=${this.handleUnpauseClick} id="resume">Resume</button>
          <button>Options</button>
          <button>Save and Exit</button>
        </div>
      </div>
    `}onInnerClick(o){o.stopPropagation()}};U.styles=y`
    :host {
      position: absolute;

      background: #ccccccee;

      height: 500px;
      width: 700px;
    }

    .content {
      display: grid;

      width: 100%;
      height: 100%;

      box-sizing: border-box;

      grid: 100px 1fr / 1fr;

      justify-content: center;
      padding: 0 150px;
    }

    h1 {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    #options {
      display: flex;
      flex-direction: column;

      justify-content: space-around;
      padding: 10% 0;
    }

    button {
      height: 50px;

      border: none;
      outline: none;
    }
  `;U=Qt([M("i-pause-menu")],U);var Xt=Object.defineProperty,Ut=Object.getOwnPropertyDescriptor,we=(o,e,t,i)=>{for(var s=i>1?void 0:i?Ut(e,t):e,r=o.length-1,n;r>=0;r--)(n=o[r])&&(s=(i?n(e,t,s):n(s))||s);return i&&s&&Xt(e,t,s),s};let D=class extends w{connectedCallback(){var o,e;super.connectedCallback(),(o=this.inventory)==null||o.addEventListener("change",async()=>await this.requestUpdate()),(e=this.waveManager)==null||e.addEventListener("update",async()=>await this.requestUpdate())}render(){var o,e,t,i,s;return g`<i-wave-info
        waveNr=${W((o=this.waveManager)==null?void 0:o.waveNumber)}
        waveCount=${W((e=this.waveManager)==null?void 0:e.waveCount)}
        totalEnemies=${W((t=this.waveManager)==null?void 0:t.totalEnemyCount)}
        enemiesAlive=${W((i=this.waveManager)==null?void 0:i.aliveEnemyCount)}></i-wave-info
      ><i-purse-info purseAmount=${W((s=this.inventory)==null?void 0:s.purseContent)}></i-purse-info>`}};D.styles=y`
    :host {
      position: absolute;

      top: 0;
      left: 0;

      width: 100vw;
      height: 100vh;
    }
  `;we([p()],D.prototype,"inventory",2);we([p()],D.prototype,"waveManager",2);D=we([M("i-permanent-hud")],D);var Yt=Object.defineProperty,Zt=Object.getOwnPropertyDescriptor,Vt=(o,e,t,i)=>{for(var s=i>1?void 0:i?Zt(e,t):e,r=o.length-1,n;r>=0;r--)(n=o[r])&&(s=(i?n(e,t,s):n(s))||s);return i&&s&&Yt(e,t,s),s};let Y=class extends w{render(){return g`
      <h1>The enemies destroyed the last crystal</h1>
      <h2>There goes the last bit of hope...</h2>
      <i-button @click=${()=>location.reload()}>Restart</i-button>
    `}};Y.styles=y`
    :host {
      position: absolute;

      background: #000000cc;

      top: 0;
      bottom: 0;
      left: 0;
      right: 0;

      z-index: 5;

      animation: forwards 1s fade-in;
    }

    h1 {
      color: red;
    }

    h2 {
      color: white;
    }

    :host > h1,
    :host > h2 {
      display: block;
      width: fit-content;
      margin: 0;

      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-49%, -50%);
      font-size: 1.5em;

      transform-origin: center;

      animation: ease-in-out forwards 3s animate-up;
    }

    i-button {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      opacity: 0;
      animation: forwards 500ms fade-in;
      animation-delay: 3s;
    }

    @keyframes animate-up {
      0% {
        font-size: 2.5em;
      }

      50% {
        font-size: 2.5em;
      }

      70% {
        font-size: 1.8em;
        top: 50%;
      }

      80% {
        font-size: 1.8em;
        top: 50%;
      }

      100% {
        font-size: 1.8em;
        top: 10%;
      }
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }
  `;Y=Vt([M("i-lose-screen")],Y);class je{constructor(e){this.isRemoved=!1,e?(this.pos=e.position,this.quaternion=e.quaternion,this.health=e.health):(this.pos=new h(0,0,0),this.quaternion=new v,this.health=100),this.isGhost=!1,this.eventManager=new oe(["broken"]),this.addEventListener=this.eventManager.addEventListener.bind(this.eventManager),this.removeEventListener=this.eventManager.removeEventListener.bind(this.eventManager)}setPosition(e){this.pos=e,this.updatedPosition()}getPosition(){return this.pos}setQuaternion(e){this.quaternion=e,this.updatedQuaternion()}setGhost(e){this.isGhost=e,this.updatedGhostStatus(this.isGhost)}decrementHealth(e){return this.health-=e,this.health<=0&&!this.isRemoved?(this.isRemoved=!0,window.buildingManager.removeGridElement(this),!0):!1}break(){this.isRemoved=!0,this.eventManager.dispatchEvent("broken")}serialize(){return JSON.stringify({position:this.pos.toArray(),quaternion:this.quaternion.toArray(),health:this.health})}}class T{constructor(){this._mesh=new G,this._cBody=new S({material:I}),this._positionOffset=new h,this._quaternionOffset=new v,this._position=new h,this._quaternion=new v,f.graphics.shadows&&(this._mesh.receiveShadow=!0,this._mesh.castShadow=!0)}addToWorld(e){e.scene.add(this._mesh),e.cScene.addBody(this._cBody)}removeFromWorld(e){e.scene.remove(this._mesh),e.cScene.removeBody(this._cBody)}updatePosition(){this._mesh.position.set(this._position.x+this._positionOffset.x,this._position.y+this._positionOffset.y,this._position.z+this._positionOffset.z),this._cBody.position.set(this._position.x+this._positionOffset.x,this._position.y+this._positionOffset.y,this._position.z+this._positionOffset.z)}updateQuaternion(){let e=new m().setFromQuaternion(this._quaternion),t=new m().setFromQuaternion(this._quaternionOffset),i=new m(e.x+t.x,e.y+t.y,e.z+t.z),s=new v().setFromEuler(i);this._mesh.quaternion.copy(s),this._cBody.quaternion.copy(s)}get mesh(){return this._mesh}set mesh(e){this._mesh=e}get cBody(){return this._cBody}set cBody(e){this._cBody=e}get positionOffset(){return this._positionOffset}set positionOffset(e){this._positionOffset=e,this.updatePosition()}get quaternionOffset(){return this._quaternionOffset}set quaternionOffset(e){this._quaternionOffset=e,this.updateQuaternion()}get position(){return this._mesh.position}set position(e){this._position=e,this.updatePosition()}get quaternion(){return this._mesh.quaternion}set quaternion(e){this._quaternion=e,this.updateQuaternion()}}class Z extends je{constructor(e,t,i){super();this.parts=[],this.addedToWorld=!1,this.world=void 0,this.setGeometries(e),this.setMaterials(t),this.addCShapes(i),this.updatedPosition=()=>{this.parts.forEach((s,r)=>{s.position=this.pos.clone()})},this.updatedQuaternion=()=>{this.parts.forEach((s,r)=>{s.quaternion=this.quaternion.clone()})}}addToWorld(e){this.addedToWorld=!0,this.world=e,(this.update!=null&&this.updatePhysics!=null||this.updateFrequencyMedium!=null)&&e.addUpdatable(this),this.parts.forEach((t,i)=>{e.scene.add(t.mesh),e.cScene.addBody(t.cBody)})}removeFromWorld(e){this.addedToWorld=!1,this.world=e,(this.update!=null&&this.updatePhysics!=null||this.updateFrequencyMedium!=null)&&e.removeUpdatable(this),this.parts.forEach((t,i)=>{e.scene.remove(t.mesh),e.cScene.removeBody(t.cBody)})}setGeometries(e){Array.isArray(e)?e.forEach((t,i)=>{this.parts[i]==null&&(this.parts[i]=new T,this.addedToWorld&&this.parts[i].addToWorld(this.world)),this.parts[i].mesh.geometry=t}):(this.parts[0]==null&&(this.parts[0]=new T,this.addedToWorld&&this.parts[0].addToWorld(this.world)),this.parts[0].mesh.geometry=e)}setMaterialAll(e){this.parts.forEach((t,i)=>{t.mesh.material=e})}setMaterials(e){Array.isArray(e)?e.forEach((t,i)=>{this.parts[i]==null&&(this.parts[i]=new T,this.addedToWorld&&this.parts[i].addToWorld(this.world)),this.parts[i].mesh.material=t}):(this.parts[0]==null&&(this.parts[0]=new T,this.addedToWorld&&this.parts[0].addToWorld(this.world)),this.parts[0].mesh.material=e)}addCShapes(e){if(Array.isArray(e)){if(Array.isArray(e[0])){e.forEach((t,i)=>{this.parts[i]==null&&(this.parts[i]=new T,this.addedToWorld&&this.parts[i].addToWorld(this.world)),e[i].forEach((s,r)=>{s.shape!=null&&this.parts[i].cBody.addShape(s.shape,s.offset)})});return}e.forEach((t,i)=>{this.parts[i]==null&&(this.parts[i]=new T,this.addedToWorld&&this.parts[i].addToWorld(this.world)),t.shape!=null&&this.parts[i].cBody.addShape(t.shape,t.offset)});return}if(this.parts[0]==null&&(this.parts[0]=new T,this.addedToWorld&&this.parts[0].addToWorld(this.world)),e.shape!=null){this.parts[0].cBody.addShape(e.shape,e.offset);return}}getParts(){return this.parts}updatedPosition(){}updatedGhostStatus(e){e&&(this.update!=null&&(this.update=void 0),this.updatePhysics!=null&&(this.updatePhysics=void 0),this.updateFrequencyMedium!=null&&(this.updateFrequencyMedium=void 0),this.updateFrequencyLow!=null&&(this.updateFrequencyLow=void 0),this.addedToWorld=!1,this.parts.forEach(t=>{try{this.world.cScene.removeBody(t.cBody)}catch{}t.cBody=new S;let i=t.mesh.material.clone();i.transparent=!0,i.opacity=.5,t.mesh.name="nointersect",this.setMaterialAll(i)}))}updatedQuaternion(){}}class qe extends Z{constructor(e,t,i){super(e,t,i)}update(e){this._update(e)}updatePhysics(e){this._updatePhysics(e)}updateFrequencyLow(e){this._updateFrequencyLow(e)}updateFrequencyMedium(e){this._updateFrequencyMedium(e)}lookAt(e){this._lookAt(e)}shoot(){this._shoot()}}class Kt extends qe{constructor(e){const t=e.getModelGeometry("generalTurret",0),i=e.getModelGeometry("generalTurret",1),s=e.getModelGeometry("generalTurret",2),r=e.getModelMaterial("generalTurret"),n=e.getModelShapes("generalTurret")[0];if(!t||!i||!s)throw new Error("Geometry couldn't be found");if(!r)throw new Error("Material couldn't be found");if(!n.shape)throw new Error("Shape couldn't be found");super([t,i,s],[r,r,r],n);this.getParts()[1].positionOffset=new h(0,1,0),this.getParts()[2].positionOffset=new h(0,2,0),this.uNameID=(Math.random()*1e4).toString(),this.getParts()[0].mesh.name=this.uNameID,this.getParts()[1].mesh.name=this.uNameID,this.getParts()[2].mesh.name=this.uNameID,this.turretRotationY=0,this.rotateToDegree(new m(0,0,0)),this.raycaster=new ge,this.shootingElements=[]}_update(e){let t=[];this.shootingElements.forEach((i,s)=>{i.progress+=3*e,i.shootingMesh.lookAt(i.targetPosition),i.shootingMesh.position.lerpVectors(i.startingPosition,i.targetPosition,i.progress),i.progress>=1&&t.push(s)}),t.forEach((i,s)=>{window.world.scene.remove(this.shootingElements[s].shootingMesh),this.shootingElements.splice(i,1)})}_updatePhysics(e){}_updateFrequencyMedium(e){}_updateFrequencyLow(e){let t,i=999999999;if(window.waveManager.currentWaves.forEach((s,r)=>{s.enemies.forEach((n,a)=>{n.mesh.position.distanceTo(this.pos)<i&&(t=n,i=n.mesh.position.distanceTo(this.pos))})}),t!=null){this.raycaster.set(this.pos,new h().subVectors(t.mesh.position,this.pos).normalize()),this.raycaster.near=0,this.raycaster.far=1e3;let s=this.raycaster.intersectObjects(window.world.scene.children,!0).filter(r=>r.object.name!="nointersect"&&r.object.name!=this.uNameID);if(s[0].object.name=="alien"||s[1].object.name=="alien"){this._lookAt(t.mesh.position.clone()),t.decrementHealth(20),this.shootingElements.push({progress:0,targetPosition:t.mesh.position.clone().add(new h(0,0,0)),startingPosition:this.pos.clone().add(new h(0,2.4,0)),shootingMesh:new G(window.resourceManager.getModelGeometry("crystalShard"),window.resourceManager.getModelMaterial("bullet"))});let r=this.shootingElements[this.shootingElements.length-1];r.shootingMesh.scale.set(.2,.1,4.4),r.shootingMesh.lookAt(r.targetPosition),window.world.scene.add(r.shootingMesh)}}}onRemove(){this.shootingElements.forEach((e,t)=>{window.world.scene.remove(this.shootingElements[t].shootingMesh)}),this.shootingElements.splice(0)}rotateToDegree(e){let t=new v;t.setFromEuler(new m(0,e.y,0)),this.getParts()[1].quaternionOffset=t.clone(),this.getParts()[1].mesh.add(this.getParts()[2].mesh),this.getParts()[2].position=new h,this.getParts()[2].quaternionOffset=new v().setFromEuler(new m(e.x,0,0))}_lookAt(e){let t=Math.atan2(this.getPosition().z-e.z,this.getPosition().x-e.x),i=Math.atan((e.y-this.getPosition().y)/this.getPosition().distanceTo(e.clone().add(new h(0,-(e.y-this.getPosition().y),0))));this.rotateToDegree(new m(-i,-t-Math.PI/2,0))}_shoot(){}}const Re=class extends q{get id(){return Re._id}get buildingElement(){return Kt}get icon(){return"../../../static/items/generalTurretItem.png"}};let Me=Re;Me._id="generalTurret";class V extends je{constructor(e,t,i){super();this.mesh=new G,f.graphics.shadows&&(this.mesh.receiveShadow=!0,this.mesh.castShadow=!0),this.cBody=new S({material:I}),this.setGeometry(e),this.setMaterial(t),this.addCShape(i),this.gridDistanceXZ=10,this.gridDistanceY=10,this.updatedPosition=()=>{this.mesh.position.copy(this.pos),this.cBody.position.copy(new u(this.pos.x,this.pos.y,this.pos.z))},this.updatedQuaternion=()=>{this.mesh.quaternion.copy(this.quaternion),this.cBody.quaternion.copy(new nt(this.quaternion.x,this.quaternion.y,this.quaternion.z,this.quaternion.w))}}addToWorld(e){e.scene.add(this.mesh),e.cScene.addBody(this.cBody)}removeFromWorld(e){e.scene.remove(this.mesh),e.cScene.removeBody(this.cBody)}setGeometry(e){this.mesh.geometry=e}setMaterial(e){this.mesh.material=e}addCShape(e){this.cBody.addShape(e)}getMesh(){return this.mesh}getCBody(){return this.cBody}getPositonOnGrid(e){let t=new h;return t.x=Math.round(e.x/this.gridDistanceXZ)*this.gridDistanceXZ,t.y=Math.round(e.y/this.gridDistanceY)*this.gridDistanceY,t.z=Math.round(e.z/this.gridDistanceXZ)*this.gridDistanceXZ,t}setPositionOnGrid(e){let t=new h;t.x=Math.round(e.x/this.gridDistanceXZ)*this.gridDistanceXZ,t.y=Math.round(e.y/this.gridDistanceY)*this.gridDistanceY,t.z=Math.round(e.z/this.gridDistanceXZ)*this.gridDistanceXZ,this.setPosition(t)}updatedPosition(){}onRemove(){}updatedGhostStatus(e){var t;if(e){(t=this.cBody.world)==null||t.removeBody(this.cBody),this.cBody=new S;let i=this.mesh.material.clone();i.transparent=!0,i.opacity=.5,this.mesh.name="nointersect",this.setMaterial(i)}}updatedQuaternion(){}}class H extends V{getXLeftWall(e){let t=new h(this.pos.x-this.gridDistanceXZ/2,this.pos.y+this.gridDistanceY/2,this.pos.z),i=new v;return i.setFromEuler(new m(0,Math.PI/2,0)),{position:t,rotation:i}}getXRightWall(e){let t=new h(this.pos.x+this.gridDistanceXZ/2,this.pos.y+this.gridDistanceY/2,this.pos.z),i=new v;return i.setFromEuler(new m(0,Math.PI/2,0)),{position:t,rotation:i}}getZFrontWall(e){let t=new h(this.pos.x,this.pos.y+this.gridDistanceY/2,this.pos.z+this.gridDistanceXZ/2),i=new v;return i.setFromEuler(new m(0,0,0)),{position:t,rotation:i}}getZBackWall(e){let t=new h(this.pos.x,this.pos.y+this.gridDistanceY/2,this.pos.z-this.gridDistanceXZ/2),i=new v;return i.setFromEuler(new m(0,0,0)),{position:t,rotation:i}}constructor(e,t,i){super(e,t,i)}}class Jt extends H{constructor(e){const t=e.getModelGeometry("woodenFloor"),i=e.getModelMaterial("woodenFloor"),s=e.getModelShape("woodenFloor");if(!t)throw new Error("Geometry couldn't be found");if(!i)throw new Error("Material couldn't be found");if(!s.shape)throw new Error("Shape couldn't be found");super(t,i,s.shape)}}const Ae=class extends q{get id(){return Ae._id}get buildingElement(){return Jt}get icon(){return"../../../static/items/woodenFloorItem.png"}};let be=Ae;be._id="woodenfloor";class ue extends V{constructor(e,t,i){super(e,t,i);this.getCBody().material=_}}class ei extends ue{constructor(e){var r;const t=e.getModelGeometry("woodenWall"),i=e.getModelMaterial("woodenWall"),s=(r=e.getModelShapes("woodenWall"))==null?void 0:r[0];if(!t)throw new Error("Geometry couldn't be found");if(!i)throw new Error("Material couldn't be found");if(!s.shape)throw new Error("Shape couldn't be found");super(t,i,s.shape)}}const Ne=class extends q{get id(){return Ne._id}get buildingElement(){return ei}get icon(){return"../../../static/items/woodenWallItem.png"}};let re=Ne;re._id="woodenwall";re._icon=void 0;class ti{constructor(e,t=.5){this.productRange=e,this.saleMultiplier=t}buyIndex(e,t){const i=this.productRange[e];if(!i)throw RangeError("Product out of range");if(t.withdraw(i.batchPrize)<i.batchPrize)throw new B("Payment is not high enough");return{item:i.item,amount:i.batchSize}}salePrice(e,t){if(t||(t=this.productRange.find(i=>e.item.id===i.item.id)),!t)throw new B("The requested item cannot be sold here!");return Math.floor(t.batchPrize/t.batchSize*this.saleMultiplier*e.amount)}sell(e,t){const i=this.productRange.find(r=>e.item.id===r.item.id);if(!i)throw new B("The requested item cannot be sold here!");const s=this.salePrice(e,i);return t.deposit(s),s}}class ii{constructor(e,t,i,s,r){this.stateMap={inventoryOverlay:!1,pauseMenu:!1};const n=document.getElementById(e);if(!n)throw new De(`Could not find element with ID '${e}'`);this.root=n,this.gameStateManager=t,this.inputManager=i,this.waveManager=r,this.store=new ti([{batchPrize:100,batchSize:1,description:"General Turret",item:new Me},{batchPrize:50,batchSize:10,description:"Wooden Wall",item:new re},{batchPrize:50,batchSize:10,description:"Wooden Floor",item:new be}]),this.playerInventory=s,this.crossHair=new Q,this.itemBar=new z,this.pauseMenu=new U,this.inventoryOverlay=new O,this.permanentHud=new D,this.loseScreen=new Y,this.root.onclick=a=>a.target!==this.permanentHud&&a.stopImmediatePropagation(),this.pauseMenu.addEventListener("unpause",()=>this.hidePauseMenu()),this.inventoryOverlay.addEventListener("slot-click",this.onSlotClick.bind(this)),this.itemBar.addEventListener("slot-click",this.onSlotClick.bind(this)),this.inventoryOverlay.addEventListener("not-enough-money",this.showNotEnoughMoneyInfo.bind(this)),this.inventoryOverlay.inventory=s,this.inventoryOverlay.store=this.store,this.itemBar.inventory=s,this.permanentHud.waveManager=this.waveManager,this.permanentHud.inventory=this.playerInventory,this.gameStateManager.addEventListener("pause",()=>this.showPauseMenu()),this.gameStateManager.addEventListener("lose",this.onLose.bind(this)),this.inputManager.addKeyCallback("i",a=>a&&this.toggleInventory()),this.inputManager.addKeyCallback("Escape",a=>a&&this.exitImmediateMenu()),this.inputManager.addKeyCallback("p",a=>a&&this.togglePauseMenu()),this.root.appendChild(this.permanentHud)}onLose(){this.root.appendChild(this.loseScreen),this.showPauseMenu=()=>{},this.hidePauseMenu()}showNotEnoughMoneyInfo(){const e=new $;e.message="You do not have enough money to purchase this!",e.addEventListener("close",()=>this.root.removeChild(e)),this.root.appendChild(e)}attach(){this.root.appendChild(this.crossHair),this.root.appendChild(this.itemBar)}handlePause(){this.stateMap.inventoryOverlay||this.showPauseMenu()}handleUnpause(){this.stateMap.inventoryOverlay||this.stateMap.pauseMenu&&this.hidePauseMenu()}exitImmediateMenu(){this.stateMap.inventoryOverlay?this.hideInventory():this.togglePauseMenu()}togglePauseMenu(){this.stateMap.pauseMenu?this.hidePauseMenu():(this.showPauseMenu(),this.gameStateManager.isPaused||this.gameStateManager.pause())}showPauseMenu(){!this.stateMap.inventoryOverlay&&this.gameStateManager.isPaused&&(this.stateMap.pauseMenu=!0,this.root.appendChild(this.pauseMenu))}hidePauseMenu(){this.stateMap.pauseMenu=!1,this.gameStateManager.isPaused&&this.gameStateManager.unpause(),this.root.removeChild(this.pauseMenu)}toggleInventory(){this.stateMap.inventoryOverlay?this.hideInventory():this.showInventory()}showInventory(){this.stateMap.inventoryOverlay=!0,this.gameStateManager.pause(),this.root.appendChild(this.inventoryOverlay)}hideInventory(){this.gameStateManager.unpause(),this.root.removeChild(this.inventoryOverlay),this.stateMap.inventoryOverlay=!1}onSlotClick(e){var t;this.movingSlot===void 0?this.playerInventory.getIndex(e.detail.idx)&&(this.showMoveSlot(e.detail.idx,e.detail.mouse),this.movingSlot=e.detail.idx):this.slot&&(this.playerInventory.moveSlot(this.movingSlot,e.detail.idx,(t=this.slot.group)==null?void 0:t.amount),this.movingSlot=void 0,this.root.removeChild(this.slot),this.slot=void 0)}showMoveSlot(e,t){this.slot=new L;const i=this.playerInventory.content[e];this.slot.group=Object.assign(Object.create(Object.getPrototypeOf(i)),i),t.button==="right"&&this.slot.group&&(this.slot.group.amount=Math.round(this.slot.group.amount/2)),this.slot.style.position="absolute",this.slot.style.left=t.pageX+"px",this.slot.style.top=t.pageY+"px",this.slot.style.transform="translate(-50%, -50%) scale(0.6)",this.slot.style.pointerEvents="none",document.addEventListener("mousemove",s=>{this.slot&&(this.slot.style.left=s.pageX+"px",this.slot.style.top=s.pageY+"px")}),this.root.appendChild(this.slot)}}class si{constructor(e,t,i,s){this.paused=!1,this.eventManager=new oe(["pause","unpause","lose"]),this.addEventListener=this.eventManager.addEventListener.bind(this.eventManager),this.removeEventListener=this.eventManager.removeEventListener.bind(this.eventManager),this.dispatchEvent=this.eventManager.dispatchEvent.bind(this.eventManager),this.inputManager=t,this.pointerLockControls=i,this.world=e,this.domElement=s,this.pointerLockControls.addEventListener("unlock",()=>this.pause()),this.addEventListener("lose",this.onLose.bind(this))}onLose(){this.pause(),window.onkeydown=e=>e.stopImmediatePropagation(),window.storageManager.clearAll()}togglePause(){this.paused?this.unpause():this.pause()}pause(){this.paused=!0,this.dispatchEvent("pause"),this.world._pause(),this.domElement.onclick=e=>e.stopPropagation()}unpause(){this.paused=!1,this.dispatchEvent("unpause"),this.world._unpause(),this.domElement.onclick=null}get isPaused(){return this.paused}get pointerLocked(){return this.pointerLockControls.isLocked}}class Be extends Error{constructor(e){super(e)}}class oi{constructor(e){this.raycaster=new ge,this.scene=e.scene,this.gridElements=[],this.freeElements=[],this.allElements=[],this.world=e,this.eventManager=new fe,this.addEventListener=this.eventManager.addEventlistener.bind(this.eventManager)}shootRayCast(e,t,i,s){return this.raycaster.set(e,t),this.raycaster.near=i,this.raycaster.far=s,this.raycaster.intersectObjects(this.world.scene.children,!0).filter(r=>r.object.name!="nointersect")}isSomethingAtPositionAlready(e){for(let t of this.allElements)if(Math.floor(t.getPosition().x)==Math.floor(e.x)&&Math.floor(t.getPosition().y)==Math.floor(e.y)&&Math.floor(t.getPosition().z)==Math.floor(e.z))return!0;return!1}isGridElementAtPositionAlready(e){for(let t of this.gridElements)if(Math.floor(t.getPosition().x)==Math.floor(e.x)&&Math.floor(t.getPosition().y)==Math.floor(e.y)&&Math.floor(t.getPosition().z)==Math.floor(e.z))return!0;return!1}objectIdToGridElement(e){let t;for(let i of this.gridElements)if(i.getMesh().id==e){t=i;break}return t}objectIdToFreeElement(e){let t;for(let i of this.freeElements)i.getParts().forEach((s,r)=>{s.mesh.id==e&&(t=i)});return t}objectIdToElement(e){let t=this.objectIdToGridElement(e);return this.objectIdToFreeElement(e)||t||void 0}getFirstIntersect(e){}shotRayCastGetBuildingElementPosition(e,t,i,s,r){if(e instanceof H){let n=this.shootRayCast(t,i,s,r);if(n.length<=0)return{position:void 0,rotation:void 0};let a=this.objectIdToGridElement(n[0].object.id);return a instanceof H?{position:e.getPositonOnGrid(new h(n[0].point.x,n[0].point.y+a.gridDistanceY,n[0].point.z)),rotation:new v().setFromEuler(new m(0,0,0))}:{position:e.getPositonOnGrid(n[0].point),rotation:new v().setFromEuler(new m(0,0,0))}}else if(e instanceof ue){let n=this.shootRayCast(t,i,s,r);if(n.length<=0)return{position:void 0,rotation:void 0};let a={position:void 0,rotation:void 0},l=this.objectIdToGridElement(n[0].object.id);if(l!=null&&l instanceof H){let c=l.getPosition(),d={zFrontPosition:new h(c.x,c.y,c.z+l.gridDistanceXZ/2),zBackPosition:new h(c.x,c.y,c.z-l.gridDistanceXZ/2),xRightPosition:new h(c.x+l.gridDistanceXZ/2,c.y,c.z),xLeftPosition:new h(c.x-l.gridDistanceXZ/2,c.y,c.z)},b={zFrontPositionDistance:n[0].point.distanceToSquared(d.zFrontPosition),zBackPositionDistance:n[0].point.distanceToSquared(d.zBackPosition),xRightPositionDistance:n[0].point.distanceToSquared(d.xRightPosition),xLeftPositionDistance:n[0].point.distanceToSquared(d.xLeftPosition)},P="";for(let ae in b)(P!=""&&b[ae]<b[P]||P=="")&&(P=ae);switch(P){case"zFrontPositionDistance":a=l.getZFrontWall(e);break;case"zBackPositionDistance":a=l.getZBackWall(e);break;case"xRightPositionDistance":a=l.getXRightWall(e);break;case"xLeftPositionDistance":a=l.getXLeftWall(e);break;default:console.error("No Smallest Position found");break}n[0].point.y<l.getMesh().position.y&&a.position!=null&&(a.position.y-=l.gridDistanceY)}else l!=null&&l instanceof ue&&(a={position:l.getMesh().position.clone(),rotation:l.getMesh().quaternion.clone()},n[0].point.y<l.getMesh().position.y&&a.position!=null?a.position.y-=l.gridDistanceY:n[0].point.y>=l.getMesh().position.y&&a.position!=null&&(a.position.y+=l.gridDistanceY));return a}else if(e instanceof qe){let n=this.shootRayCast(t,i,s,r);return n.length<=0?{position:void 0,rotation:void 0}:{position:n[0].point.clone(),rotation:new v().setFromEuler(new m(0,0,0))}}return{position:void 0,rotation:void 0}}addGridElement(e){e.addToWorld(this.world),e instanceof V&&this.gridElements.push(e),e instanceof Z&&this.freeElements.push(e),this.allElements.push(e)}removeGridElement(e){e.onRemove(),e.break(),e.removeFromWorld(this.world),e instanceof V&&this.gridElements.forEach((t,i)=>{t==e&&this.gridElements.splice(i,1)}),e instanceof Z&&this.freeElements.forEach((t,i)=>{t==e&&this.freeElements.splice(i,1)}),this.allElements.forEach((t,i)=>{t==e&&this.allElements.splice(i,1)}),this.eventManager.dispatchEvent("remove",{element:e})}addGhostElement(e){e.setGhost(!0),e.addToWorld(this.world)}removeGhostElement(e){e.setGhost(!1),e.removeFromWorld(this.world)}}class He{constructor(e,t){this.radius=1.3,this.colliderRadius=3,this.velocityMultiplier=10,this.isMoving=!1,this.movePaused=!1,this.targetRadius=8,this.health=100,this.deltaC=0;const i=window.resourceManager.getModelGeometry("alien"),s=window.resourceManager.getModelMaterial("alien"),r=new ze(this.colliderRadius);this.mesh=new G(i,s),this.mesh.name="alien",this.mesh.castShadow=!0,this.mesh.receiveShadow=!0,this.mesh.scale.set(1.3,1.3,1.3),this.cBody=new S({mass:10,shape:r}),this.cBody.linearDamping=.999,this.cBody.fixedRotation=!0,this.onNoHealth=t,this.cBody.position.copy(e),this.mesh.position.copy(this.cBody.position),this.onBroken=this.onBroken.bind(this),window.interactionManager.addEventListener({type:"left",id:this.mesh.id},()=>this.decrementHealth(50))}onBroken(){this.toBreak=void 0,this.isMoving&&(this.movePaused=!1,this.cBody.wakeUp())}updateFrequencyMedium(e){this.toBreak&&this.toBreak.decrementHealth(1)}updateFrequencyLow(e){if(!this.toBreak){const t=window.buildingManager.freeElements,i=window.buildingManager.gridElements,s=[...t,...i].filter(r=>r.getPosition().distanceTo(this.mesh.position)<10);s.length>0&&(this.toBreak=s[0],this.toBreak.addEventListener("broken",this.onBroken),this.isMoving&&(this.movePaused=!0))}}addToWorld(e){e.scene.add(this.mesh),e.cScene.addBody(this.cBody),e.addUpdatable(this)}removeFromWorld(e){e.scene.remove(this.mesh),e.cScene.removeBody(this.cBody)}moveTowards(e,t=8){this.targetPosition=e,this.isMoving=!0,this.targetRadius=t,this.updateTargetNormal()}updateTargetNormal(){var t;if(!this.targetPosition)return;const e=(t=this.targetPosition)==null?void 0:t.clone().sub(this.mesh.position);this.targetNormal=e.normalize().multiplyScalar(4)}isAtTarget(){return this.cBody.position.distanceTo(this.targetPosition)<this.targetRadius}decrementHealth(e){var t;this.health-=e,this.health<=0&&((t=this.onNoHealth)==null||t.call(this))}set onNoHealthFunction(e){this.onNoHealth=e}get currentHealth(){return this.health}get isBreaking(){return this.toBreak!==void 0}update(e){}updatePhysics(e){var t,i;if(this.mesh.position.copy(this.cBody.position),this.isMoving){if(this.cBody.velocity.x=(((t=this.targetNormal)==null?void 0:t.x)||this.cBody.velocity.x)*(this.movePaused?.001:1),this.cBody.velocity.z=(((i=this.targetNormal)==null?void 0:i.z)||this.cBody.velocity.z)*(this.movePaused?.001:1),this.targetPosition){const s=Math.atan2(this.mesh.position.z-this.targetPosition.z,this.mesh.position.x-this.targetPosition.x);this.mesh.setRotationFromEuler(new m(0,-s-Math.PI,0))}this.isAtTarget()&&(this.isMoving=!1)}}}class ri{constructor(e=new h(0,0,0),t=10,i,s,r){this.enemies=[],this.center=e,this.onFinish=r,this.world=i,this.eventManager=new fe,this.addEventListener=this.eventManager.addEventlistener.bind(this.eventManager),s||(s=10),this.initialEnemyCount=s;for(let n=0;n<s;n++){const a=Math.random()*2*Math.PI,l=t*Math.cos(a)+e.x,c=t*Math.sin(a)+e.z,d=new h(l,e.y,c),b=new He(d);b.onNoHealthFunction=()=>this.removeEnemy(b),this.enemies.push(b)}this.updateIntervalId=setInterval(()=>{for(const n of this.enemies)n.updateTargetNormal()},2e3)}removeEnemy(e){var i;const t=this.enemies.findIndex(s=>e===s);if(t<0)throw new Error("The enemy to be removed is not part of this wave");e.removeFromWorld(this.world),this.enemies.splice(t,1),this.enemies.length<=0&&((i=this.onFinish)==null||i.call(this)),this.eventManager.dispatchEvent("removed_enemy",e)}addToWorld(e){for(const t of this.enemies)t.addToWorld(e)}startMoving(e){this.onFinish=e;for(const t of this.enemies)t.moveTowards(this.center)}stopMoving(){clearInterval(this.updateIntervalId)}set onFinished(e){this.onFinish=e}get totalEnemyCount(){return this.initialEnemyCount}get aliveEnemyCount(){return this.enemies.length}}function ni(o){return he({currentInterval:1e3*60*8,intervalDeviation:.1,intervalMultiplier:.95,currentEnemyCount:5,enemyCountDeviation:.2,enemyCountMultiplier:1.1,enemySpawnRadius:100},o)}class Ee{constructor(e,t,i,s=!0){this.target=i,this.currentWaves=[],this.config=ni(e),this.world=t,this.eventManager=new fe,this.addEventListener=this.eventManager.addEventlistener.bind(this.eventManager),s&&this.initializeNextInterval()}start(){!this.nextInterval&&!this.intervalId&&this.initializeNextInterval()}initializeNextInterval(e=!0){const t=Ee.generateInterval(this.config.currentInterval,this.config.intervalDeviation);e&&(this.config.currentInterval*=this.config.intervalMultiplier),this.nextInterval=new Date().getTime()+t,console.debug(`Next wave at ${new Date(this.nextInterval)}`),this.intervalId=setTimeout(()=>this.startWave(),t)}startWave(){var t;this.waveNr=((t=this.waveNr)!=null?t:0)+1,this.eventManager.dispatchEvent("wave",this.waveNr),this.eventManager.dispatchEvent("update",void 0);const e=new ri(this.target,this.config.enemySpawnRadius,this.world,this.config.currentEnemyCount);e.addEventListener("removed_enemy",()=>this.eventManager.dispatchEvent("update",void 0)),e.addToWorld(this.world),e.startMoving(()=>this.removeWaveFromArray(e)),this.currentWaves.push(e),this.initializeNextInterval()}removeWaveFromArray(e){const t=this.currentWaves.findIndex(s=>s===e);if(t<0)return;const i=this.currentWaves.splice(t,1);return this.eventManager.dispatchEvent("finish",i[0]),this.eventManager.dispatchEvent("update",void 0),i}pause(){if(!this.intervalId){console.warn("The WaveManager can only be paused when waves are scheduled");return}this.stopTime=new Date().getTime(),clearTimeout(this.intervalId),this.intervalId=void 0}unpause(){if(!this.stopTime||!this.nextInterval)return;const e=this.nextInterval-this.stopTime;this.nextInterval=new Date().getTime()+e,this.intervalId=setTimeout(()=>this.startWave(),e),console.log(`New wave at ${new Date(this.nextInterval)}`)}static generateInterval(e,t){const i=e-e*t,s=e+e*t;return Math.floor(Math.random()*(s-i+1)+i)}get waveNumber(){return this.waveNr}get totalEnemyCount(){return this.currentWaves.reduce((e,t)=>e+t.totalEnemyCount,0)}get aliveEnemyCount(){return this.currentWaves.reduce((e,t)=>e+t.aliveEnemyCount,0)}get waveCount(){return this.currentWaves.length}}class ai{constructor(e,t=.2){this.deltaY=t,this.timeAlive=0,this.meshOffset=new h(0,0,0),this.addedToObject=!1,this.staticElevation=0,this.geometry=window.resourceManager.getModelGeometry("crystalShard"),this.material=window.resourceManager.getModelMaterial("crystalShard"),this.mesh=new G(this.geometry,this.material),this.mesh.scale.set(.3,.3,.3),this.mesh.castShadow=!0,this.mesh.receiveShadow=!1,this.cShape=new x(new u(.3,.3,.3)),this.cBody=new S({shape:this.cShape,material:_,mass:.1}),this.cBody.position.copy(new u(e.x,e.y,e.z)),this.cBody.linearFactor=new u(0,1,0),this.cBody.angularFactor=new u(0,1,0),this.mesh.position.copy(this.cBody.position),this.staticElevation=e.y}addToWorld(e){e.scene.add(this.mesh),e.cScene.addBody(this.cBody),e.addUpdatable(this)}removeFromWorld(e){e.scene.remove(this.mesh),e.cScene.removeBody(this.cBody)}addToObject(e){e.add(this.mesh),this.addedToObject=!0}removeFromObject(e){e.remove(this.mesh),this.addedToObject=!1}update(e){this.timeAlive+=e,this.meshOffset.y=Math.sin(this.timeAlive*2)*this.deltaY+this.deltaY,this.mesh.quaternion.setFromEuler(new m(0,this.timeAlive/2,0)),this.addedToObject&&(this.mesh.position.y=this.staticElevation+this.meshOffset.y)}updatePhysics(e){this.mesh.position.x=this.cBody.position.x+this.meshOffset.x,this.mesh.position.y=this.cBody.position.y+this.meshOffset.y,this.mesh.position.z=this.cBody.position.z+this.meshOffset.z}}class hi{constructor(e,t){this.func=e,this.every=t,this.lastDispatch=new Date().getTime(),this.intervalId=setTimeout(this.dispatch.bind(this),t)}dispatch(){this.intervalId=setTimeout(this.dispatch.bind(this),this.every),this.lastDispatch=new Date().getTime(),this.func()}pause(){this.intervalId&&(clearTimeout(this.intervalId),this.remaining=this.every-(new Date().getTime()-this.lastDispatch),this.intervalId=void 0)}unpause(){this.intervalId==null&&(this.intervalId=setTimeout(this.dispatch.bind(this),this.remaining),this.remaining=void 0)}}class li extends Z{constructor(e,t){var a,l;const i=e.getModelGeometry("crystal",0),s=e.getModelGeometry("crystal",1),r=e.getModelMaterial("crystal"),n=e.getModelShape("crystal");if(!i||!s)throw new Error("Geometry for crystal could not be found");if(!r)throw new Error("Material for crystal could not be found");if(!n)throw new Error("Shape for crystal could not be found");super([i,s],[r,r],n);this.gameStateManager=t,this.crystalRotation=0,this.shards=[],this.interval=new hi(()=>this.addShard(),2e3),(a=this.gameStateManager)==null||a.addEventListener("pause",this.pause.bind(this)),(l=this.gameStateManager)==null||l.addEventListener("unpause",this.unpause.bind(this)),window.interactionManager.addEventListener({type:"right",id:this.getParts()[1].mesh.id},this.collectShards.bind(this))}addShard(){const e=Math.random()*16,t=16-e,i=new ai(new h(Math.sqrt(e)*(Math.random()<.5?-1:1)*.8,3.5,Math.sqrt(t)*(Math.random()<.5?-1:1)*.8),.5);i.addToObject(this.getParts()[1].mesh),this.shards.push(i)}collectShards(){const e=this.shards.length*10;window.playerInventory.desposit(e),this.shards.forEach(t=>t.removeFromObject(this.getParts()[1].mesh)),this.shards=[]}pause(){this.interval.pause()}unpause(){this.interval.unpause()}update(e){this.crystalRotation+=e,this.getParts()[1].quaternion.setFromEuler(new m(0,this.crystalRotation/2,0));const{x:t,z:i}=this.getParts()[1].positionOffset;this.getParts()[1].positionOffset=new h(t,Math.sin(this.crystalRotation*1.5)/5+.4,i),this.shards.forEach(s=>s.update(e))}updatePhysics(e){}onRemove(){this.break()}break(){var e;super.break(),(e=this.gameStateManager)==null||e.dispatchEvent("lose")}}class di{constructor(e,t,i){this.bufferVector=new h,this.leftListeners=new Map,this.rightListeners=new Map,this.raycaster=new ge,this.camera=i,this.scene=e,this.inputManager=t,this.eventManager=new oe(["right","left"]),this.inputManager.addMouseButtonCallback(3,s=>s&&this.onRightClick()),this.inputManager.addMouseButtonCallback(1,s=>s&&this.onLeftClick())}shootRaycast(e=0,t=50){if(this.camera)return this.raycaster.set(this.camera.position,this.camera.getWorldDirection(this.bufferVector)),this.raycaster.near=e,this.raycaster.far=t,this.raycaster.intersectObjects(this.scene.children,!0).filter(i=>i.object.name!=="nointersect");throw new Error("Not camera defined")}onRightClick(){const e=this.shootRaycast();if(e[0]){const t=e[0].object.id,i=this.rightListeners.get(t),s=this.rightListeners.get(void 0);i&&i.forEach(r=>r({type:"right",id:t},e[0])),s&&s.forEach(r=>r({type:"right",id:t},e[0]))}}onLeftClick(){const e=this.shootRaycast();if(e[0]){const t=e[0].object.id,i=this.leftListeners.get(t),s=this.leftListeners.get(void 0);i&&i.forEach(r=>r({type:"left",id:t},e[0])),s&&s.forEach(r=>r({type:"left",id:t},e[0]))}}addEventListener(e,t){if(e.type==="left"){const i=this.leftListeners.get(e.id)||[];this.leftListeners.set(e.id,[...i,t])}else{const i=this.rightListeners.get(e.id)||[];this.rightListeners.set(e.id,[...i,t])}}set perspectiveCamera(e){this.camera=e}}function Le(o){return o.updateFrequencyMedium!==void 0&&o.updateFrequencyLow!==void 0}class ci{constructor(){this.items=new Map}registerItem(e,t){if(this.items.has(e))throw new B("The item id to be registered already exists");this.items.set(e,t)}getItem(e){return this.items.get(e)}safeSlotToObject(e){if(typeof e!="object"||typeof e.item!="object"||typeof e.item.id!="string"||e.item.class!==!0)return e;const t=this.getItem(e.item.id);if(t)return Se(he({},e),{item:new t})}}class ui{constructor(){this.cleared=!1}getOrInitInventory(...e){const t=localStorage.getItem("i-store.inventory");return t?(this.inventory=C.fromSerialized(t,e[0],e[1],e[2]),this.inventory):(this.inventory=new C(...e),this.inventory.desposit(200),this.inventory)}saveAll(){if(this.cleared){this.cleared=!1;return}this.inventory&&localStorage.setItem("i-store.inventory",this.inventory.serialize())}clearAll(){localStorage.removeItem("i-store.inventory"),this.cleared=!0}}class pi{generateFloor(){this.floorGeometry=new at(1e3,1e3,50,50),this.floorMaterial=new E({color:10526880}),this.floorMesh=new G(this.floorGeometry,this.floorMaterial),this.floorMesh.receiveShadow=!0,this.floorMesh.receiveShadow=!0,this.scene.add(this.floorMesh),this.cFloorShape=new ht,this.cFloorBody=new S({mass:0,material:I}),this.cFloorBody.addShape(this.cFloorShape),this.cFloorBody.quaternion.setFromAxisAngle(new u(1,0,0),-Math.PI/2),this.cFloorBody.position.y=0,this.floorMesh.position.copy(this.cFloorBody.position),this.floorMesh.quaternion.copy(this.cFloorBody.quaternion),this.cScene.addBody(this.cFloorBody)}constructor(e,t=80,i=.1,s=1e3){window.itemTypeRegistry=new ci,window.itemTypeRegistry.registerItem("woodenfloor",be),window.itemTypeRegistry.registerItem("generalTurret",Me),window.itemTypeRegistry.registerItem("woodenwall",re);const r=document.getElementById(e);if(!r)throw new De(`A canvas with the ID '${e}' was not found!`);this.renderer=new lt({canvas:r,antialias:!0}),this.renderer.setSize(r.clientWidth,r.clientHeight,!1),this.buildingManager=new oi(this),this.inputManager=new Et,this.inputManager.addKeyCallback("f",d=>{!d||this.renderer.domElement.requestFullscreen()}),this.scene=new dt;const n=r.clientWidth/r.clientHeight;this.loadingManager=new xt,this.resourceManager=new St(this.loadingManager),this.resourceManager.setFinishedModelLoadingCallback((()=>{this.player.startGhostClock();const d=new li(this.resourceManager,this.gameStateManager);d.setPosition(new h(0,0,0)),this.buildingManager.addGridElement(d),this.floorMesh.material=new E({map:this.resourceManager.getModelTexture("grass")})}).bind(this)),window.resourceManager=this.resourceManager,this.resourceManager.loadModelTexture("grass","static/grasTexture.png"),this.resourceManager.getModelTexture("grass").wrapS=Ce,this.resourceManager.getModelTexture("grass").wrapT=Ce,this.resourceManager.getModelTexture("grass").repeat=new ct(50,50),this.resourceManager.loadModelGeometry("debugFloor","static/debugFloor.glb"),this.resourceManager.loadModelGeometry("debugWall","static/debugWall.glb"),this.resourceManager.loadModelGeometry("debugMonke","static/debugMonke.glb"),this.resourceManager.loadModelGeometry("defaultWorld","static/defaultWorld.glb"),this.resourceManager.addModelMaterial("bullet",new E({color:6321264})),this.resourceManager.loadModelGeometries("alien","static/alien.glb"),this.resourceManager.loadModelTexture("alien","static/alienTexture.png"),this.resourceManager.addModelShape("alien",new x(new u(2,2,2)),new u(0,0,0)),this.resourceManager.addModelMaterial("alien",new E({map:this.resourceManager.getModelTexture("alien")})),this.resourceManager.loadModelGeometries("crystal","static/crystal.glb"),this.resourceManager.loadModelTexture("crystal","static/crystalTexture.png"),this.resourceManager.addModelShape("crystal",new x(new u(2.5,5,2.5)),new u(0,0,0)),this.resourceManager.addModelMaterial("crystal",new E({map:this.resourceManager.getModelTexture("crystal")})),this.resourceManager.loadModelGeometries("crystalShard","static/crystalShard.glb"),this.resourceManager.loadModelTexture("crystalShard","static/crystalShardTexture.png"),this.resourceManager.addModelMaterial("crystalShard",new E({map:this.resourceManager.getModelTexture("crystalShard")})),this.resourceManager.loadModelGeometries("generalTurret","static/generalTurret.glb"),this.resourceManager.addModelShape("generalTurret",new x(new u(2.5,2.5,2.5)),new u(0,0,0),0,0),this.resourceManager.loadModelTexture("generalTurret","static/generalTurretTexture.png"),this.resourceManager.addModelMaterial("generalTurret",new E({map:this.resourceManager.getModelTexture("generalTurret")})),this.resourceManager.loadModelGeometry("woodenFloor","static/woodenFloor.glb"),this.resourceManager.loadModelTexture("woodenFloor","static/woodenFloorTexture.png"),this.resourceManager.addModelMaterial("woodenFloor",new E({map:this.resourceManager.getModelTexture("woodenFloor")})),this.resourceManager.addModelShape("woodenFloor",new x(new u(5,.1,5)),new u(0,0,0)),this.resourceManager.loadModelGeometry("woodenWall","static/woodenWall.glb"),this.resourceManager.loadModelTexture("woodenWall","static/woodenWallTexture.png"),this.resourceManager.addModelMaterial("woodenWall",new E({map:this.resourceManager.getModelTexture("woodenWall")})),this.resourceManager.addModelShape("woodenWall",new x(new u(5,5,.1)),new u(0,0,0)),this.resourceManager.addModelMaterial("debugFloor",new E({color:16711935})),this.resourceManager.addModelMaterial("debugWall",new E({color:65535})),this.resourceManager.addModelMaterial("debugMonke",new E({color:16711935})),this.resourceManager.addModelMaterial("defaultWorld",new E({color:16711935})),this.resourceManager.addModelShape("debugFloor",new x(new u(5,.1,5)),new u(0,0,0)),this.resourceManager.addModelShape("debugWall",new x(new u(5,5,.1)),new u(0,0,0)),this.updatables=[],this.cScene=new ut,this.cScene.gravity.set(0,-60,0),this.cScene.broadphase=new pt(this.cScene);const a=new le(I,I,{friction:.4,restitution:.3,contactEquationStiffness:1e8,contactEquationRelaxation:3,frictionEquationStiffness:1e8});this.cScene.addContactMaterial(a);const l=new le(I,_,{friction:.02,restitution:.01});this.cScene.addContactMaterial(l);const c=new le(_,_,{friction:.01,restitution:.01,contactEquationStiffness:1e8,contactEquationRelaxation:5});if(this.cScene.addContactMaterial(c),this.cSolver=new gt,this.cSolver.iterations=100,this.cSolver.tolerance=.1,this.cScene.solver=new mt(this.cSolver),this.cScene.allowSleep=!0,this.generateFloor(),this.interactionManager=new di(this.scene,this.inputManager),window.interactionManager=this.interactionManager,window.storageManager=new ui,this.player=new Pt(n,t,i,s,this.inputManager,this.buildingManager,this.resourceManager,this.scene,this.renderer.domElement),this.player.addToWorld(this),this.camera=this.player.camera,window.playerInventory=this.player.inventory,window.buildingManager=this.buildingManager,new He(new h(5,5,100)),this.inputManager.pointerLockControls=this.player.pointerLockControls,this.gameStateManager=new si(this,this.inputManager,this.player.pointerLockControls,this.renderer.domElement),this.waveManager=new Ee({currentInterval:2e4,intervalMultiplier:.9},this,new h(0,0,10),!1),this.hudManager=new ii("hud-root",this.gameStateManager,this.inputManager,this.player.inventory,this.waveManager),this.hudManager.attach(),window.waveManager=this.waveManager,this.waveManager.start(),this.interactionManager.perspectiveCamera=this.player.camera,this.ambientLight=new ft(8421504),this.directionalLight=new vt(14671839,.9),this.directionalLight.position.set(1,1,1),f.graphics.shadows){let d=50;this.directionalLight.shadow.camera.top=d,this.directionalLight.shadow.camera.bottom=-d,this.directionalLight.shadow.camera.left=d,this.directionalLight.shadow.camera.right=-d,this.directionalLight.shadow.mapSize.width=f.graphics.shadowsize,this.directionalLight.shadow.mapSize.height=f.graphics.shadowsize,this.directionalLight.shadow.bias=-.001,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Te,this.directionalLight.castShadow=!0,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Te,this.renderer.outputEncoding=yt,this.renderer.toneMapping=wt,this.renderer.toneMappingExposure=.4}this.scene.add(this.ambientLight),this.scene.add(this.directionalLight),this.scene.add(this.directionalLight.target),this.sceneSky=new Mt,this.sceneSky.scale.setScalar(35e4),this.sceneSky.material.uniforms.turbidity.value=10,this.sceneSky.material.uniforms.rayleigh.value=3,this.sceneSky.material.uniforms.mieCoefficient.value=.005,this.sceneSky.material.uniforms.mieDirectionalG.value=.7,this.sceneSky.material.uniforms.sunPosition.value.copy(new h().setFromSphericalCoords(1,ke.degToRad(90-50),ke.degToRad(50))),this.scene.add(this.sceneSky),this.deltaClock=new de,this.deltaTime=0,this.deltaPhysicsClock=new de,this.deltaPhysicsTime=0,window.onbeforeunload=()=>(window.storageManager.saveAll(),null)}handleResize(){const e=this.renderer.domElement;return e.width!==e.clientWidth||e.height!==e.clientHeight?(this.renderer.setSize(e.clientWidth,e.clientHeight,!1),this.camera.aspect=e.clientWidth/e.clientHeight,this.camera.updateProjectionMatrix(),!0):!1}getUpdatables(){return this.updatables}addUpdatable(e){this.updatables.push(e)}removeUpdatable(e){this.updatables.forEach((t,i)=>{t==e&&this.updatables.splice(i,1)})}getPlayer(){return this.player}tick(e){var t,i,s,r;this.deltaTime=this.deltaClock.getDelta(),this.update(),this.updatePhysics(),this.render(),this.requestId=requestAnimationFrame(this.tick.bind(this)),this.deltaClock.elapsedTime-((t=this.lastMediumDispatch)!=null?t:0)>.1&&this.updateFrequencyMedium(this.deltaClock.elapsedTime-((i=this.lastMediumDispatch)!=null?i:0)),this.deltaClock.elapsedTime-((s=this.lastLowDispatch)!=null?s:0)>1&&this.updateFrequencyLow(this.deltaClock.elapsedTime-((r=this.lastLowDispatch)!=null?r:0))}update(){this.player.update(this.deltaTime),this.updatables.forEach(e=>{e.update(this.deltaTime)}),f.graphics.shadows&&(this.directionalLight.position.set(this.player.camera.position.x+30,this.player.camera.position.y+30,this.player.camera.position.z+30),this.directionalLight.target=this.player.camera)}updatePhysics(){this.deltaPhysicsTime=this.deltaPhysicsClock.getDelta(),this.player.updatePhysics(this.deltaPhysicsTime),this.updatables.forEach(e=>{e.updatePhysics(this.deltaPhysicsTime)}),this.deltaPhysicsTime>0&&this.cScene.step(this.deltaPhysicsTime)}updateFrequencyMedium(e){this.lastMediumDispatch=this.deltaClock.elapsedTime,this.updatables.forEach(t=>{Le(t)&&t.updateFrequencyMedium(e)})}updateFrequencyLow(e){this.lastLowDispatch=this.deltaClock.elapsedTime,this.updatables.forEach(t=>{Le(t)&&t.updateFrequencyLow(e)})}render(){this.handleResize(),this.renderer.render(this.scene,this.camera)}_pause(){if(!this.requestId)throw new Be("The game is already paused");this.lastMediumDispatch=void 0,this.lastLowDispatch=void 0,cancelAnimationFrame(this.requestId),this.deltaClock.stop(),this.deltaPhysicsClock.stop(),this.requestId=void 0,this.player.pointerLockControls.unlock(),this.waveManager.pause()}_unpause(){if(this.requestId)throw new Be("The game is not paused");this.deltaClock.start(),this.deltaPhysicsClock.start(),this.requestId=requestAnimationFrame(this.tick.bind(this)),document.body.focus(),this.waveManager.unpause()}start(){this.gameStateManager.unpause()}}var gi=Object.defineProperty,mi=Object.getOwnPropertyDescriptor,Qe=(o,e,t,i)=>{for(var s=i>1?void 0:i?mi(e,t):e,r=o.length-1,n;r>=0;r--)(n=o[r])&&(s=(i?n(e,t,s):n(s))||s);return i&&s&&gi(e,t,s),s};let K=class extends w{connectedCallback(){var o;super.connectedCallback(),(o=this.inventory)==null||o.addEventListener("change",async()=>await this.requestUpdate())}handleSlotClick(o,e){const t=$e(e,o);if(!!t)return e.preventDefault(),e.stopPropagation(),this.dispatchEvent(t),!1}render(){var o;return(o=this.inventory)==null?void 0:o.backContent.map((e,t)=>g`<i-inventory-slot
          @click=${i=>this.handleSlotClick(t,i)}
          @contextmenu=${i=>this.handleSlotClick(t,i)}
          .group=${e?{item:e.item,amount:e.amount}:void 0}></i-inventory-slot>`)}};K.styles=y`
    :host {
      display: block;
      position: relative;
      width: 100%;
      max-width: 100%;
      margin-bottom: 10%;

      justify-content: center;

      display: grid;

      grid-template-columns: repeat(auto-fill, 50px);
      grid-template-rows: repeat(auto-fill, 50px);

      gap: 10px;
    }
  `;Qe([p()],K.prototype,"inventory",2);K=Qe([M("i-inventory")],K);var fi=Object.defineProperty,vi=Object.getOwnPropertyDescriptor,Xe=(o,e,t,i)=>{for(var s=i>1?void 0:i?vi(e,t):e,r=o.length-1,n;r>=0;r--)(n=o[r])&&(s=(i?n(e,t,s):n(s))||s);return i&&s&&fi(e,t,s),s};let J=class extends w{constructor(){super();this.addEventListener("wheel",o=>o.stopPropagation())}handleBuyClick(o){const e=new CustomEvent("store-buy",{detail:{index:o}});this.dispatchEvent(e)}render(){var o;return(o=this.store)==null?void 0:o.productRange.map((e,t)=>g`<i-store-slot @buy-click=${()=>this.handleBuyClick(t)} .definition=${e}></i-store-slot>`)}};J.styles=y`
    :host {
      position: relative;
      box-sizing: border-box;

      width: 100%;
      max-width: 100%;
      padding: 0 20px;
      margin-bottom: 10%;

      display: flex;
      flex-direction: column;

      gap: 10px;

      overflow-y: auto;
    }
  `;Xe([p()],J.prototype,"store",2);J=Xe([M("i-store")],J);var yi=Object.defineProperty,wi=Object.getOwnPropertyDescriptor,Ue=(o,e,t,i)=>{for(var s=i>1?void 0:i?wi(e,t):e,r=o.length-1,n;r>=0;r--)(n=o[r])&&(s=(i?n(e,t,s):n(s))||s);return i&&s&&yi(e,t,s),s};let ee=class extends w{handleBuyClick(){const o=new CustomEvent("buy-click");this.dispatchEvent(o)}render(){if(!this.definition)return g``;const o={item:this.definition.item,amount:this.definition.batchSize};return g`<div id="icon-container"><i-inventory-slot .group=${o}></i-inventory-slot></div>
      <div class="transaction-area">
        <h1>${this.definition.description}</h1>
        <h2>x ${this.definition.batchSize}</h2>

        <i-button @click=${()=>this.handleBuyClick()}>Buy for ${this.definition.batchPrize} shards</i-button>
      </div>`}};ee.styles=y`
    :host {
      display: grid;
      grid: 1fr / max-content 1fr;

      border: 2px solid #777777;

      background: #cccccccc;

      padding: 10px;
    }

    i-inventory-slot {
      margin: 0 10px;
    }

    #icon-container {
      display: flex;

      align-items: center;
      justify-content: center;
    }

    h1,
    h2,
    button {
      margin: 0;
    }

    h1 {
      font-size: 1.5rem;
    }

    h2 {
      font-size: 1.2rem;
      font-weight: normal;
    }

    i-button {
      margin-top: 20px;
    }

    .transaction-area {
      display: grid;

      grid: 1.2fr 1fr / 1fr;

      justify-items: center;
    }
  `;Ue([p()],ee.prototype,"definition",2);ee=Ue([M("i-store-slot")],ee);var Mi=Object.defineProperty,bi=Object.getOwnPropertyDescriptor,ne=(o,e,t,i)=>{for(var s=i>1?void 0:i?bi(e,t):e,r=o.length-1,n;r>=0;r--)(n=o[r])&&(s=(i?n(e,t,s):n(s))||s);return i&&s&&Mi(e,t,s),s};let F=class extends w{constructor(){super(...arguments);this.percentage=0,this.color="black",this.weight=2}render(){const o=isNaN(this.percentage)?0:this.percentage;return g`
      <style>
        div {
          transform: rotate(calc(45deg + ${o*1.8}deg));

          border: ${this.weight}px solid ${this.color};
        }
      </style>
      <div></div>
    `}};F.styles=y`
    :host {
      position: relative;
      aspect-ratio: 1;
      display: block;

      transform: translate(-50%);
    }

    div {
      height: 100%;
      width: 100%;

      box-sizing: border-box;

      border-radius: 50%;
      border-bottom-color: transparent;
      border-left-color: transparent;
    }
  `;ne([p({type:Number})],F.prototype,"percentage",2);ne([p({type:String})],F.prototype,"color",2);ne([p({type:Number})],F.prototype,"weight",2);F=ne([M("i-progress-circle")],F);var Ei=Object.defineProperty,Pi=Object.getOwnPropertyDescriptor,xi=(o,e,t,i)=>{for(var s=i>1?void 0:i?Pi(e,t):e,r=o.length-1,n;r>=0;r--)(n=o[r])&&(s=(i?n(e,t,s):n(s))||s);return i&&s&&Ei(e,t,s),s};let pe=class extends w{render(){return g` <button><slot></slot></button> `}};pe.styles=y`
    button {
      font-size: 1rem;

      outline: none;
      border: 2px solid #777777;
      border-radius: 5px;

      background: white;

      padding: 5px 20px;
    }
  `;pe=xi([M("i-button")],pe);var Si=Object.defineProperty,Ci=Object.getOwnPropertyDescriptor,N=(o,e,t,i)=>{for(var s=i>1?void 0:i?Ci(e,t):e,r=o.length-1,n;r>=0;r--)(n=o[r])&&(s=(i?n(e,t,s):n(s))||s);return i&&s&&Si(e,t,s),s};let k=class extends w{constructor(){super(...arguments);this.waveNr=0,this.waveCount=0,this.totalEnemies=1,this.enemiesAlive=1}render(){return g` <div id="progress-indicator">
        <i-progress-circle
          percentage="${100-this.enemiesAlive/this.totalEnemies*100}"
          color="red"
          weight="4"></i-progress-circle
        ><i-progress-circle color="#000000aa"></i-progress-circle>
        <h2>${this.enemiesAlive}</h2>
      </div>
      <div id="active">
        <h2>${this.waveCount}</h2>
        <h3>Active</h3>
      </div>
      <div id="level">
        <h2>${this.waveNr}</h2>
        <h3>Level</h3>
      </div>`}};k.styles=y`
    :host {
      position: absolute;
      top: min(4%, 4rem);
      height: 5rem;
      min-width: 10rem;
      width: fit-content;

      display: flex;

      background: #cccccccc;

      overflow: hidden;
    }

    h1,
    h2,
    h3 {
      margin: 0;
    }

    #progress-indicator {
      position: relative;

      height: 100%;
      width: min-content;
    }

    #progress-indicator > h2 {
      position: absolute;
      top: 50%;
      left: 0.5rem;

      transform: translateY(-50%);
    }

    i-progress-circle {
      height: 100%;
    }

    i-progress-circle:nth-of-type(2) {
      position: absolute;
      top: -2.5%;

      height: calc(105%);
    }

    div:not(#progress-indicator) {
      margin-right: 2rem;

      display: flex;
      flex-direction: column;

      justify-content: space-evenly;
      align-items: center;
    }
  `;N([p()],k.prototype,"waveNr",2);N([p()],k.prototype,"waveCount",2);N([p()],k.prototype,"totalEnemies",2);N([p()],k.prototype,"enemiesAlive",2);k=N([M("i-wave-info")],k);var Ti=Object.defineProperty,ki=Object.getOwnPropertyDescriptor,Ye=(o,e,t,i)=>{for(var s=i>1?void 0:i?ki(e,t):e,r=o.length-1,n;r>=0;r--)(n=o[r])&&(s=(i?n(e,t,s):n(s))||s);return i&&s&&Ti(e,t,s),s};let te=class extends w{constructor(){super(...arguments);this.purseAmount=0}render(){return g`
      <h2>${this.purseAmount}</h2>
      <h3>Shards</h3>
    `}};te.styles=y`
    :host {
      position: absolute;
      top: calc(min(4%, 4rem) + 5rem + 1rem);
      height: 5rem;
      min-width: 10rem;
      width: fit-content;

      background: #cccccccc;

      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
    }

    h2,
    h3 {
      margin: 0;
    }
  `;Ye([p({type:Number})],te.prototype,"purseAmount",2);te=Ye([M("i-purse-info")],te);let Ze=new pi("view");window.world=Ze;Ze.tick();
