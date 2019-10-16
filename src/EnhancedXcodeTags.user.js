// ==UserScript==
// @name          xNULL EnhancedXcodeTags
// @namespace     EnhancedXcodeTags
// @description   Improved xcode tags for the xNULL forum
// @version       0.1.1
// @author        Zappa (eduzappa18)
// @license       MIT; https://github.com/eduzappa18/EnhancedXcodeTags/blob/master/LICENSE
// @homepageURL   https://github.com/eduzappa18/EnhancedXcodeTags
// @supportURL    https://github.com/eduzappa18/EnhancedXcodeTags/issues
// @updateURL     https://eduzappa18.github.io/EnhancedXcodeTags/src/EnhancedXcodeTags.user.js
// @downloadURL   https://eduzappa18.github.io/EnhancedXcodeTags/src/EnhancedXcodeTags.user.js
// @match         https://www.x-null.net/forums*
// @run-at        document-body
// @grant         unsafeWindow
// @grant         GM_getValue
// @grant         GM_setValue
// @icon          https://www.x-null.net/forums/favicon.ico
// ==/UserScript==

'use strict';

if (typeof unsafeWindow.Prism === "undefined") {
	console.log("[xNULL EnhancedXcodeTags] No Prism object, returning");
	return;
}

PrismHack();

// Disable xNULL prism style
const xnull_prism = document.querySelector('link[href*="forums/xcode/prism.css"]');
xnull_prism.setAttribute("disabled", "disabled");

// Custom styles
const prism_base = "https://eduzappa18.github.io/EnhancedXcodeTags/src/css/prism-base.css";
const monokai_light = "https://eduzappa18.github.io/EnhancedXcodeTags/src/css/prism-light.css";
const monokai_dark = "https://eduzappa18.github.io/EnhancedXcodeTags/src/css/prism-dark.css";
const switch_style = "https://eduzappa18.github.io/EnhancedXcodeTags/src/css/xcode-switch.css";
const firacode_font = "https://cdn.jsdelivr.net/gh/tonsky/FiraCode@1.207/distr/fira_code.css";

const light_theme = monokai_light;
const dark_theme = monokai_dark;

const base = document.createElement('link');
base.setAttribute("rel", "stylesheet");
base.setAttribute("type", "text/css");
base.setAttribute("href", `${prism_base}?v=${GM.info.script.version}`);

const light = document.createElement('link');
light.setAttribute("rel", "stylesheet");
light.setAttribute("type", "text/css");
light.setAttribute("href", `${light_theme}?v=${GM.info.script.version}`);
light.setAttribute("disabled", "disabled");

const dark = document.createElement('link');
dark.setAttribute("rel", "stylesheet");
dark.setAttribute("type", "text/css");
dark.setAttribute("href", `${dark_theme}?v=${GM.info.script.version}`);
dark.setAttribute("disabled", "disabled");

const input_css = document.createElement('link');
input_css.setAttribute("rel", "stylesheet");
input_css.setAttribute("type", "text/css");
input_css.setAttribute("href", `${switch_style}?v=${GM.info.script.version}`);

const fira_code = document.createElement('link');
fira_code.setAttribute("rel", "stylesheet");
fira_code.setAttribute("type", "text/css");
fira_code.setAttribute("href", `${firacode_font}?v=${GM.info.script.version}`);

document.head.append(base);
document.head.append(dark);
document.head.append(light);
document.head.append(input_css);
document.head.append(fira_code);

if (GM_getValue("dark_mode") === undefined) {
	GM_setValue("dark_mode", JSON.stringify(false));
}

document.addEventListener('DOMContentLoaded', function() {
	const blocks = document.querySelectorAll('pre.line-numbers');
	for (const block of blocks) {
		let wrapper = document.createElement("div");
			wrapper.setAttribute("class", "xcode_container");

		let div = document.createElement("div");
			div.setAttribute("class", "input-container");
			div.setAttribute("title", "Toggle Color Theme");

		let input = document.createElement("input");
			input.setAttribute("id", "darkTheme");
			input.setAttribute("class", "xcode_switch");
			input.setAttribute("type", "checkbox");
			input.addEventListener('change', darkSwitch, false);

		let label = document.createElement("label");
			label.setAttribute("class", "xcode_switch");
			label.setAttribute("for", "darkTheme");

		block.parentNode.insertBefore(wrapper, block);
		div.append(input);
		div.append(label);
		wrapper.append(block);
		wrapper.append(div);
	}

	if (JSON.parse(GM_getValue("dark_mode", "{}")) === true) {
		toggleSwitch(true);
		dark.removeAttribute("disabled");
		light.setAttribute("disabled", "disabled");
	} else if (JSON.parse(GM_getValue("dark_mode", "{}")) === false) {
		toggleSwitch(false);
		light.removeAttribute("disabled");
		dark.setAttribute("disabled", "disabled");
	}

	function darkSwitch() {
		if (this.checked) {
			toggleSwitch(true);
			dark.removeAttribute("disabled");
			light.setAttribute("disabled", "disabled");
			GM_setValue("dark_mode", JSON.stringify(true));
		} else {
			toggleSwitch(false);
			light.removeAttribute("disabled");
			dark.setAttribute("disabled", "disabled");
			GM_setValue("dark_mode", JSON.stringify(false));
		}
	}

	function toggleSwitch(value) {
		const inputs = document.querySelectorAll('input.xcode_switch');
		for (const input of inputs) {
			input.checked = value;
		}
	}
});

function PrismHack() {
	unsafeWindow.Prism.languages.moh = null;
	unsafeWindow.Prism.languages.mohaa = null;
	unsafeWindow.Prism.languages.scr = null;

	unsafeWindow.Prism.languages.moh = {
		'comment': [
			{
				pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
				lookbehind: true
			},
			{
				pattern: /(^|[^\\:])\/\/.*/,
				lookbehind: true,
				greedy: true
			}
		],
		'string': {
			pattern: /(["])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
			greedy: true
		},
		'moh-thread': {
			pattern: /^([ \t]+)*(?!\b(default|case)\b)[\w-]+(?=([ \t]+[\w\.-]+)*[:])/m,
			lookbehind: true
		},
		'keyword': /\b(break|case|catch|continue|default|else|end|for|goto|if|switch|throw|try|while)\b/,
		'boolean': /\b(NULL|NIL)\b/i,
		'variable': /\B\$|\b(game|level|local|parm|self|group)\b/,
		'function': {
			pattern: /([^\.])\b(abs|accuracy|actionanimend|activate|activateitem|activatenewweapon|activatepapers|ActivateSound|activatetrigger|active|actor|actorinfo|add|additionalstartammo|addkills|addmusictrigger|addobjective|addownervelocity|addrandomspeaker|addreverbtrigger|addspeaker|addvelocity|ai_event|ai_off|ai_on|ai_visiondistance|aibulletspread|aimat|aimoffset|aimtarget|aimtolerance|airange|alarm|alarmnode|alarmthread|alias|aliascache|all_ai_off|all_ai_on|AlliesObjNum|alpha|altcurrent|altfallback|altreverblevel|altreverbtype|alwaysaway|alwaysdraw|american|ammo|ammo_grenade|ammo_in_clip|ammoentity_postspawn|ammopickupsound|ammorequired|ammotype|amount|angle|angles|angles_pointat|angles_toforward|angles_toleft|angles_toup|anglespeed|anim|anim_attached|anim_noclip|anim_scripted|animated_farplane|animated_farplane_bias|animated_farplane_color|AnimationSet|animdone|animfinal|animloop|animloop_legs|animloop_pain|animloop_torso|animname|animscript|animscript_attached|animscript_noclip|animscript_scripted|arc|arctotarget|arena|armor|assert|attach|AttachDriverSlot|attachedmodelanim|attachgrenade|attachmodel|AttachPassengerSlot|attachtohand|attachtoladder|AttachTurretSlot|attackhandler|attackmode|attackplayer|auto_active|auto_join_team|auto_maxfov|auto_radius|auto_starttime|auto_state|auto_stoptime|autoaim|autoputaway|avelocity|avoidplayer|AxisObjNum|back_mass|badplace|balconyheight|barreltype|base_velocity|beam|becomebomb|bedead|BeginCycle|bind|blendtime|blockend|blockstart|bloodmodel|BlowUp|bombs_planted|bool|bouncefactor|bouncesound|bouncesound_hard|bouncesound_metal|bouncesound_water|bouncesoundchance|bouncetouch|breakspecial|brushmodel|bsptransition|bulletcount|bulletdamage|bulletknockback|bulletlarge|bulletrange|bulletspread|burstFireSettings|cache|calcgrenadetoss|calcgrenadetoss2|callvote|cam|camera|camera_think|cancelFor|canhitowner|canjump|canmoveto|cansee|canseenoents|canshoot|canshootenemyfrom|cantpartialreload|censor|centerprint|centroid|chance|channel|charge|chargelife|chargespeed|checkanims|checkonground|cinematic|classname|clear_objective_pos|clearAimTarget|clearfade|clearletterbox|clearowner|clip_add|clip_empty|clip_fill|clipsize|clockside|close|closeportal|cnt|collisionent|color|commanddelay|Complete|cone|connect_paths|constantdamage|continue|ControlledBy|convergeTime|cooktime|coord|correctweaponattachments|count|crawlto|CreateListener|crosshair|crouchto|cuecamera|cueplayer|current|cut|Cycles|damage|damage_multiplier|damage_type|damageagain|damageeveryframe|damagemult|damagepuff|damagesounds|damagetype|dampening|deactivate|deactivateweapon|dead|deadbody|deathembalm|deathhandler|deathsinkeachframe|deathsinkstart|debrismodel|debristype|debug_int3|debugline|defaultnonvislevel|delay|delaythrow|delete|DestroyModel|detach|detachallchildren|DetachDriverSlot|detachgrenade|DetachPassengerSlot|DetachTurretSlot|detail|dialogneeded|disablespawn|disconnect_paths|disguise_accept_thread|disguise_level|disguise_period|disguise_range|distancetoenemy|dlight|dm|dmammorequired|dmamount|dmbulletcount|dmbulletdamage|dmbulletrange|dmbulletspread|dmcantpartialreload|dmcrosshair|dmdeathdrop|dmfiredelay|dmfirespreadmult|dmg|dmlife|dmmaxamount|dmmessage|dmmovementspeed|dmprojectile|dmrealism|dmrespawning|dmroundlimit|dmstartammo|dmteam|dmzoomspreadmult|doActivat|doActivate|doBlocked|doclose|dog|doinit|dojitter|donedeath|donefiring|donereloading|dontdropweapons|doopen|door_triggerfield|doorclosed|dooropened|doortype|doroundtransition|doTouch|doUse|dprintln|drawhud|drivable|drive|driveNoWait|dropitems|droptofloor|dropturret|drunk|dumb|duration|earthquake|edgeeffect|edgetriggered|effects|emitter|emotion|enableEnemy|enablePain|enablespawn|end|endactionanim|endalpha|endArray|EndCycle|endlevel|endpath|endpoint|enemy|enemy_visible_change_time|enemysharerange|enemyswitchdisable|enemyswitchenable|ensureforwardoffladder|ensureoverladder|enter|entity|entitystart|entnum|error|exec|exit|explode|Explode|explodeontouch|explosionattack|explosioneffect|explosionmodel|explosionoffset|explosions|ExplosionSound|eyeslookat|face|fade|fadedelay|fadein|fadeout|fadesound|fadetime|fakebullets|fallback|fallheight|fallingangleadjust|farclipoverride|farplane|farplane_bias|farplane_color|farplane_cull|farplaneclipcolor|favoriteenemy|findendpoint|findenemy|finishroundtransition|finishuseanim|finishuseobject|fire|fire_grenade|firedelay|FireOnStartUp|firespreadmult|firetype|firewarmupdelay|fixedleash|flags|flash|float|flypath|follow|follow_distance|follow_yaw|follow_yaw_absolute|follow_yaw_relative|followpath|forceactivate|forcelegsstate|forcemusic|forcetorsostate|forwardvector|found_secrets|fov|freezeplayer|front_mass|fullheal|fullstop|fuse|gameversion|german|get_render_terrain|getboundkey1|getboundkey2|getcontrollerangles|getcvar|GetLocalYawFromVector|getmaxs|getmins|getmovement|getposition|GetRunAnim|gettagangles|gettagposition|gettargetentity|GetWalkAnim|ghost|give|givedynitem|giveweapon|globaltranslate|glue|gotkill|goto|gravity|gren_awareness|gun|gvo|handlespawn|has_disguise|hascompletelookahead|headmodel|headskin|heal|health|health_postspawn|healthonly|hearing|heatseek|hide|hidemenu|hidemouse|hitdamage|hiteffect|holster|holsterangles|holsteroffset|holsterscale|holstertag|huddraw_align|huddraw_alpha|huddraw_color|huddraw_font|huddraw_rect|huddraw_shader|huddraw_string|huddraw_virtualsize|hurt|ID|idle|idleCheckOffset|idleinit|idlesay|ignorebadplaces|ignoreclock|immediateremove|immune|impactmarkorientation|impactmarkradius|impactmarkshader|initialize|inpvs|inreload|int|interrupt_point|interval|intervaldir|invnext|invprev|iprint|iprintln|iprintln_noloc|iprintlnbold|iprintlnbold_noloc|is_disguised|is_enemy_visible|isalive|isAlive|IsAlive|isdonut|isloopinganim|istouching|isTouching|isturnedon|item|item_droptofloor|item_pickup|jitteramount|join_team|joinTeam|jump|jumpto|jumpxy|key|kickdir|kill|killattach|killclass|killed|killedeffect|killent|killtarget|killthread|killtrace|knockback|land_angles|land_radius|last_enemy_visible_time|launchsound|lavaalpha|lavacolor|leash|leave_team|leftvector|letterbox|leveltransition|life|light|lightBlue|lightGreen|lightOff|lightOn|lightRadius|lightRed|lightStyle|limit|linkdoor|linkturret|lip|listinventory|load|loaded|loc_convert_string|locatecamera|lock|lockmovement|locprint|lod_angles|lod_discard|lod_model|lod_roll|lod_spawn|lod_think|lod_yaw|logstats|lookaroundangle|lookat|loop|loop_protection|loopfire|loopsound|low_wall_arc|mainattachtotag|makeArray|makenoise|map|mass|max_health|max_time|maxalpha|maxamount|maxchargetime|MaxDelay|maxdelay|maxdist|maxdonut|MaxDuration|maxfiremovement|maxgibs|maxIdlePitch|maxIdleYaw|maxmouthangle|maxmovementsound|MaxNumShots|maxoffset|maxrange|maxs|maxuseangle|maxYawOffset|meansofdeath|meleeattackend|meleeattackstart|message|min_dist|min_time|minchargetime|MinDelay|mindelay|mindist|mindonut|MinDuration|minlife|MinNumShots|minoffset|minrange|mins|minspeed|missionfailed|missiontransition|model|Model|modelname|modheight|modifydrive|modifyflypath|mood|motionfail|move|moveanim|moveBackward|movedir|movedone|movedoneradius|moveDown|moveEast|movefail|moveForward|moveLeft|movementspeed|movementstealth|moveNorth|moveOffset|moveplayer|moveposflags|moveRight|movesound|moveSouth|moveto|movetopos|moveUp|moveWest|moving_from_anim|mprint|mprintln|multifaceted|mumble|music|musicvolume|name|neverdraw|new|next|nextcamera|nextdrive|nextmap|nextpaintime|nextpath|no_idle|no_remove|noammosound|noanimlerp|noclip|nodamage|nodrophealth|noise|nolongpain|noncinematic|nonvislevel|normal_damage|normal_health|normalangles|normaldraw|northyaw|noshadow|nosurprise|notactive|notarget|notdroppable|noticescale|notouchdamage|notready|notshootable|notsolid|nottriggerable|nowatch|num_loops|numarenas|numfireanims|numsegments|numspherebeams|objectivebased|objectivecount|ObjectiveNbr|off|offhandattachtotag|offset|on|oneshot|onfire|open|openangle|opendot|openportal|orbit|orbit_height|orientedbbox|origin|other|overcooked|overcooked_warning|overlap|owner|pain|painhandler|papers|path_relativeyaw|pathdist|patrolpath|pause|pauseanims|perferredweapon|persist|physics_off|physics_on|physics_velocity|pickup|pickup_done|pickup_thread|pickupoffset|pickupsound|pickweapon|pitchCaps|pitchSpeed|placeturret|planting_team|play|playerspawn|PlayMovie|playpreimpact|playsound|pointat|pophelmet|popmenu|position|powerupname|poweruptimer|preimpactsound|preimpactsoundprob|preimpactsoundtime|prespawnsentient|prethink|prev|previewreverb|previousthread|prevpath|primarydmweapon|print|print3d|println|projectile|psetviewangles|pusher|pushmenu|pushsound|putawayweapon|QueryDriverSlotAngles|QueryDriverSlotEntity|QueryDriverSlotPosition|QueryDriverSlotStatus|QueryFreeDriverSlot|QueryFreePassengerSlot|QueryFreeTurretSlot|QueryPassengerSlotEntity|QueryPassengerSlotPosition|QueryPassengerSlotStatus|QueryTurretSlotEntity|QueryTurretSlotPosition|QueryTurretSlotStatus|quiet|quitTeam|radius|Radius|radiusdamage|radnum|rain_density|rain_length|rain_min_dist|rain_numshaders|rain_shader|rain_slant|rain_speed|rain_speed_vary|rain_width|random|random_velocity|randomfloat|randomint|range|rank|ready|ReadyToFire|realism|releasefire|releaseplayer|reload|reload_mg42|reloaddelay|reloadshots|reloadweapon|remove|removeattachedmodel|removebadplace|removeclass|removeent|removeimmune|removeondeath|removewhenstopped|renamepath|render_terrain|rendereffects|replace|reset|reset_time|resetdelay|resethaveitem|resetleash|resetreverb|resetsound|resetspeed|resetstate|respawn|respawn_done|respawnsound|restoremusicvolume|restoresoundtrack|reverblevel|reverbtype|rightvector|roll|rotateaxis|rotateaxisdown|rotateaxisdownto|rotateaxisup|rotateaxisupto|rotatedbbox|rotatedownto|rotateto|rotateupto|rotateX|rotateXdown|rotateXdownto|rotateXup|rotateXupto|rotateY|rotateYdown|rotateYdownto|rotateYup|rotateYupto|rotateZ|rotateZdown|rotateZdownto|rotateZup|rotateZupto|roundbased|runanimrate|runsounds|runto|safeholster|safesolid|safezoom|save|savemap|savename|say|saydone|sayfail|scale|scalerate|score|scriptshader|scriptslave_followingpath|scriptslave_movedone|seatanglesoffset|seatoffset|secondary|secondaryammoinhud|self|semiauto|server|set_objective_pos|set_respawn|set_respawn_time|setactionanim|setaimanim|setaimmotionanim|setAimOffset|setaimtarget|setAimTarget|setanim|setanimlength|setbaseentity|setcollisionentity|setcontrollerangles|SetCurrent|setcurrentfireanim|setcurrentobjective|setcvar|SetDamage|setdamage|setfadetime|setfov|sethelmet|setlightstyle|setmeansofdeath|setmotionanim|setpath|setPlayerUsable|setreloadcover|setsay|setshaderdata|setshadertime|setsize|setsoundparameters|setspeed|setsynctime|settarget|settargetentity|settargetname|setthread|setupperanim|setusable|setusethread|setvolumeparameters|setweapon|setyawfrombone|severity|shader|shadow|share_enemy|share_grenade|shareclip|shoot|shootableonly|shootradius|show|showmenu|showquakes|showweapon|sight|sighttrace|silent|sinksound|skidding|skill|skipcinematic|skyalpha|skybox_farplane|skybox_speed|skyportal|smashthroughglass|solid|sound|sound_awareness|sound_close_end|sound_close_start|sound_locked|sound_message|sound_open_end|sound_open_start|SoundSet|soundtrack|sp|spawn|spawnbloodygibs|spawnchance|spawnflags|spawnitem|spawnlife|spawnmodel|spawnrate|spawnspot|spawntarget|spawntargetname|spawnturret|spectator|speed|spin|SplinePath_create|sprealism|start|startammo|startangles|startfiring|startFiring|startingammotoowner|startitem|startorigin|startuseobject|startyaw|state|state_backwards|stationary|stats|steerinplace|stickybombwet|stop|stopatend|stopfire|stopFiring|stoploopsound|stoponfire|stopped|stoprotating|stopsound|stopwatch|StopWatchDuration|stopwatchingactor|string|stuffcmd|stufftext|stunend|stunstart|suppresschance|suppressHeight|suppressTime|suppressWaitTime|suppressWidth|surface|svflags|switchfacet|take|takeall|takedamage|TakeOver|takepain|target|targetname|targets_destroyed|targets_to_destroy|targettype|team|teamwin|tele|testmojo|testplayeranim|testthread|tether|Text|thinkstate|thread|threadmove|threatbias|throughmetal|throughwood|throw|throwgib|throwsound|TickCycle|TickSound|tileshader|time|timedecay|timeout|toggledelay|toggledoor|toggleitem|toss|total_secrets|touchtriggers|trace|tracerfreq|tracerfrequency|tracerspeed|trigger|triggerable|triggered|triggereffect|triggereffectalt|triggername|triggertarget|triggerthread|trysolid|tryToOpen|turn|turndoneerror|turnlegs|TurnOff|TurnOn|turnrate|turnspeed|turnSpeed|turnto|turnupdate|turret|turretenter|turretexit|turrettik|tweakladderpos|type_attack|type_disguise|type_grenade|type_idle|unattachfromladder|unbind|undrivable|unglue|unholster|unlock|unlockmovement|unregister|updatebeam|updateendpoint|updateinput|updateorigin|updatepoweruptime|upperanim|upperfail|upvector|use|usebbox|UsedModel|uselast|usematerial|usenoammo|userdistance|usestuff|useweaponclass|vector_add|vector_closer|vector_cross|vector_dot|vector_length|vector_normalize|vector_scale|vector_subtract|vector_toangles|vector_within|vehicleanim|vehiclebouncy|vehicledestroyed|vehicledrag|vehicleinit|vehiclemass|vehicleradius|vehicleRoll|vehiclerollingresistance|vehiclesoudnentity_updatetraces|vehiclesoundentity_postspawn|vehiclespeed|vehiclespringy|vehicletread|VehicleWheelCorners|vehicleYaw|vehicleZ|velocity|viewangles|viewanimate|viewattach|viewdelete|viewdeleteall|viewdetach|viewdetachall|viewjitter|viewkick|viewlastframe|viewmodel|viewmodelanim|viewnext|viewnextanim|viewOffset|vieworigin|viewpitch|viewprev|viewprevanim|viewroll|viewsavesurfaces|viewscale|viewscaledown|viewscaleup|viewscrub|viewsetanim|viewsetanim2|viewsetanimslot|viewspawn|viewthing_think|viewthingnext|viewthingprev|viewyaw|voicetype|volume|volumedamage|vote|wait|waitexec|waitForState|waitframe|waitmove|waitthread|waittill|waittrigger|walkto|warmupdelay|watch|watchactor|watchnode|watchpath|watchstring|wateralpha|watercolor|weapdrop|weapnext|weapon|weapon_internal|weaponcommand|weapongroup|weaponsubtype|weapontype|weapprev|whatis|worldhitspawn|wuss|yaw|yaw_offset|yawCenter|zoom|zoommovement|zoomoff|zoomspreadmult|adddeaths|addkills|bindweap|charToInt|conprintf|getactiveweap|getclientnum|getconnstate|getdate|getdeaths|getentity|getip|getkills|getping|gettime|gettimezone|inventory|isadmin|md5file|md5string|netname|registerev|stuffsrv|teamswitchdelay|traced|typeof|unregisterev|userinfo|fopen|fclose|feof|fseek|ftell|frewind|fputc|fputs|fgetc|fgets|ferror|fflush|fexists|freadall|fsaveall|fremove|frename|fcopy|freadpak|flist|ihuddraw_align|ihuddraw_alpha|ihuddraw_color|ihuddraw_font|ihuddraw_rect|ihuddraw_shader|ihuddraw_string|ihuddraw_virtualsize|cos|sin|tan|acos|asin|atan|atan2|cosh|sinh|tanh|exp|frexp|ldexp|log|log10|modf|pow|sqrt|ceil|floor|fmod)\b/i,
			lookbehind: true
		},
		'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
		'operator': /[-+]{1,2}|!=?|<{1,2}=?|>{1,2}=?|\->|={1,2}|\^|~|%|&{1,2}|\|?\||\?|\*|\/|::/,
		'punctuation': /[{}[\];(),.:]/
	};
	unsafeWindow.Prism.languages.mohaa = unsafeWindow.Prism.languages.moh;
	unsafeWindow.Prism.languages.scr = unsafeWindow.Prism.languages.moh;
}