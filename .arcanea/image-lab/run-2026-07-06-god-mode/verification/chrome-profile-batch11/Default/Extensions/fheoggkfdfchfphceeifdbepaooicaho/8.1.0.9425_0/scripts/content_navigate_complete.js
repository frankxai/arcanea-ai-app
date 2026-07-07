/*!
 * 
 *     MCAFEE RESTRICTED CONFIDENTIAL
 *     Copyright (c) 2026 McAfee, LLC
 *
 *     The source code contained or described herein and all documents related
 *     to the source code ("Material") are owned by McAfee or its
 *     suppliers or licensors. Title to the Material remains with McAfee
 *     or its suppliers and licensors. The Material contains trade
 *     secrets and proprietary and confidential information of McAfee or its
 *     suppliers and licensors. The Material is protected by worldwide copyright
 *     and trade secret laws and treaty provisions. No part of the Material may
 *     be used, copied, reproduced, modified, published, uploaded, posted,
 *     transmitted, distributed, or disclosed in any way without McAfee's prior
 *     express written permission.
 *
 *     No license under any patent, copyright, trade secret or other intellectual
 *     property right is granted to or conferred upon you by disclosure or
 *     delivery of the Materials, either expressly, by implication, inducement,
 *     estoppel or otherwise. Any license under such intellectual property rights
 *     must be expressed and approved by McAfee in writing.
 *
 */(()=>{"use strict";const e={NONE:0,INFO:1,ERROR:2,WARN:3,DEBUG:4,ALL_IN_BACKGROUND:99},s={BACKGROUND:"BACKGROUND",CONTENT:"CONTENT",TELEMETRY:"TELEMETRY"},t={DEFAULT:"color: #000000; font-weight: normal; font-style:normal; background: #FFFFFF;",BACKGROUND:"color: #8D0DBA; font-weight: bold; background: #FFFFFF;",CONTENT:"color: #F54A26; font-weight: bold; background: #FFFFFF;",TELEMETRY:"color: #147831; font-weight: bold; background: #FFFFFF;"},o=new class{constructor(){this.storageChecked=!1,this.logLevel=null,this.queue=[];const s="MCLOGLEVEL";chrome?.storage?.local.get([s]).then((t=>{const o=Object.values(e).includes(t[s]);this.logLevel=o?t[s]:0,this.logLevel!==e.NONE&&this.queue.forEach((({callback:e,message:s,processType:t})=>{e(s,t)})),this.queue=[],this.storageChecked=!0}))}log(e,s=null){this.storageChecked?this.processLog(e,1,s,this.logLevel):this.queue.push({callback:this.log.bind(this),message:e,processType:s})}error(e,s=null){this.storageChecked?this.processLog(e,2,s,this.logLevel):this.queue.push({callback:this.error.bind(this),message:e,processType:s})}warn(e,s=null){this.storageChecked?this.processLog(e,3,s,this.logLevel):this.queue.push({callback:this.warn.bind(this),message:e,processType:s})}debug(e,s=null){this.storageChecked?this.processLog(e,4,s,this.logLevel):this.queue.push({callback:this.debug.bind(this),message:e,processType:s})}processLog(t,o,r,c){if(c===e.NONE)return;let a="chrome-extension:"===location.protocol?s.BACKGROUND:s.CONTENT;r&&s[r]&&(a=r);const n=this.formatDateWithMilliseconds(new Date),i=2===o?t:`%c[${a} ${n} ]: %c${t}`;a===s.CONTENT&&this.logLevel===e.ALL_IN_BACKGROUND&&chrome.runtime.sendMessage({command:"PRINT_IN_BACKGROUND",logMessage:i,processType:a,logType:o,logLevel:c}),this.printLog(i,a,o,c)}formatDateWithMilliseconds(e){return`${new Intl.DateTimeFormat("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0}).format(e)}.${e.getMilliseconds().toString().padStart(3,"0")}`}printLog(s,o,r,c){const a=t.DEFAULT,n=t[o]||a;if(c>=e.ERROR&&2===r&&console.error(s),c>=e.INFO&&1===r&&console.log(s,n,a),c>=e.WARN&&3===r){const e="color: #FFA500; font-family: sans-serif; font-weight: bolder; text-shadow: #000 1px 1px;";console.log(`%cWARN - ${s}`,e,n,a)}if(c>=e.DEBUG&&4===r){const e="color: #FF33D7; font-family: sans-serif; font-weight: bolder; text-shadow: #000 1px 1px;";console.log(`%cDEBUG - ${s}`,e,n,a)}}},r=(e,s={},t)=>(async(e,s,t={},r={})=>{try{if(r?.tabId){const{tabId:o,frameId:c}=r;return await((e,s,t,o,r=null)=>{if(!chrome.tabs)throw new Error('"tabs" permission not set in manifest.');const c={};return"number"==typeof r&&(c.frameId=r),chrome.tabs.sendMessage(o,{ipcId:e,command:s,...t},c)})(e,s,t,o,c)}if(r?.broadcast){const c=await chrome.tabs.query({}),{broadcastIgnoreId:a=[]}=r;return c.filter((({id:e})=>!a.includes(e))).forEach((({id:r})=>{(async(e,s,t,r)=>{try{chrome.tabs.sendMessage(r,{ipcId:e,command:s,...t},{},(()=>{chrome.runtime.lastError}))}catch(e){o.warn(`[broadcast] Unexpected error when calling command: "${s}", err: ${e.message}`)}})(e,s,t,r)})),!0}return await chrome.runtime.sendMessage({ipcId:e,command:s,...t})}catch(e){return o.warn(`Unexpected error when calling command: "${s}", err: ${e.message}`),null}})("WA",e,s,t);(class{static start(){try{r("NAVIGATE_COMPLETE")}catch(e){}}}).start()})();
//# sourceMappingURL=../sourceMap/chrome/scripts/content_navigate_complete.js.map