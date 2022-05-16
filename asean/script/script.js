/*MAP SETUP*/
// const extent = Cesium.Rectangle.fromDegrees(112.921124550164,-43.7429686004967,153.660861,-9.14118954253052);//(W,S,E,N)

const extent = Cesium.Rectangle.fromDegrees(89.05625,-11.40989,142.63109,29.22864);//(W,S,E,N)

Cesium.Camera.DEFAULT_VIEW_RECTANGLE = extent;
// Cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

const osm = new Cesium.OpenStreetMapImageryProvider({
	url:'https://{s}.basemaps.cartocdn.com/light_nolabels'
});
const viewer = new Cesium.Viewer('cesiumContainer', {
	imageryProvider: osm,
	timeline: false,
	animation: false,
	geocoder: false,
	baseLayerPicker: false,////////////////////////
	sceneModePicker: false,
	navigationHelpButton: false,
	homeButton: false,
	fullscreenButton: false,
	skyBox: false,

	// imageryProvider: Cesium.createWorldImagery({
	// 	style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
	// }),

	// selectionIndicator : false,
	// infoBox : false,

	// sceneMode: Cesium.SceneMode.SCENE2D,``
	// mapMode2D: Cesium.MapMode2D.ROTATE,
});

let stateBoundaries = new Cesium.CustomDataSource("stateBoundaries")

viewer.dataSources.add(stateBoundaries);

//viewer.scene.globe.depthTestAgainstTerrain = true;//https://community.cesium.com/t/render-polygons-on-ground/7096//2109101041

/*MAP SETUP*/

/*GLOBAL VARIABLES*/
const colours = [[255,0,0],[255,106,0],[255,213,0],[191,255,0],[84,255,0],[0,255,22],[0,255,128],[0,255,234],[0,169,255],[0,63,255],[42,0,255],[148,0,255],[254,0,253],[255,0,147],[255,0,41],[255,64,0],[255,170,0],[233,255,0],[127,255,0],[21,255,0],[0,255,86],[0,255,192],[0,211,255],[0,105,255],[0,0,255],[106,0,255],[212,0,255],[255,0,190],[255,0,83],[255,21,0],[255,128,0],[255,234,0],[169,255,0],[63,255,0],[0,255,43],[0,255,149],[0,254,255],[0,148,255],[0,41,255],[63,0,255],[169,0,255],[255,0,232],[255,0,126],[255,0,20],[255,85,0],[255,191,0],[212,255,0],[106,255,0],[1,255,1],[0,255,107],[0,255,213],[0,190,255],[0,84,255],[21,0,255],[127,0,255],[233,0,255],[255,0,168],[255,0,62],[255,43,0],[255,149,0]]

const stateBox = {//W,S,E,N
	"Indonesia": [93,-13,143,6],
	"Malaysia": [98,0,120,8],
	"Vietnam": [100,8,110,24],
	"Cambodia": [102,10,108,15],
	"Laos": [100,13,108,23],
	"Thailand": [97,5,106,21],
	"Brunei": [114,4,116,5],
	"Myanmar": [91,9,102,29],
	"The Philippines": [115,4,128,20],
	"Singapore": [103.5,1.1,104.5,1.5],

	"all": [89.05625,-11.40989,142.63109,29.22864]
}

const countryColours = {
	"Indonesia": [222, 37, 8],
	"Malaysia": [224, 0, 147],
	"Vietnam": [134, 0, 219],
	"Cambodia": [224, 104, 0],
	"Laos": [0, 221, 245],
	"Thailand": [0, 245, 126],
	"Brunei": [20, 235, 0],
	"Myanmar": [240, 237, 0],
	"The Philippines": [224, 171, 0],
	"Singapore": [1, 23, 219]
}

const stateColours = {
	NSW:[0,170,255],
	QLD:[150,50,100],
	VIC:[45,45,50],
	TAS:[0,140,75],
	SA:[255,0,0],
	WA:[220,160,0],
	NT:[255,100,0],
	ACT:[255,200,0]
}

let selections = {
	stateBoundaries:{},
	clear:{},
	lgas:{},
	stateDivisions:{},
	federal:{},
	zones:{},
	broadcast:{},
	localities:{},
}
let guidSelect = {
	stateBoundaries:{},
	clear:{},
	// lgas:{},
	// stateDivisions:{},
	// federal:{},
	// zones:{},
	// broadcast:{},
	// localities:{},
}
/*GLOBAL VARIABLES*/

/*H*O*V*E*R*/
/*const hoverLabel = viewer.entities.add({
	label: {
		show: false,
		showBackground: true,
		horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
		verticalOrigin: Cesium.VerticalOrigin.TOP,
		pixelOffset: new Cesium.Cartesian2(15, 0),
	},
});

const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

const mouseMove = (e)=>{
	$('.tooltip').css({
		left:`${e.clientX}px`,
		top:`${e.clientY}px`
	})
}
$('body').on('mousemove',mouseMove)

handler.setInputAction((movement)=>{
	let pickedObject = viewer.scene.pick(movement.endPosition);

	// switch(true){
	// 	case !Cesium.defined(pickedObject) && window['hover'] == undefined://there is no entity AND there WASN'T one
	// 	case Cesium.defined(pickedObject) && pickedObject['collection'] != undefined://there IS an entity but it's a label
	// 	return false;

	// 	case window['hover'] != undefined && pickedObject != window['hover']://there was an entity but not this one
	// 	window['hover']['id']['label']['show'] = false;
	// 	break;
	// }

	switch(true){
		case !Cesium.defined(pickedObject)://there is no entity
		$('.tooltip').html('').addClass('displayNone');
		// case pickedObject['collection'] != undefined://the entity is a label//captioned out for including localities
		// hoverLabel.label.show = false;
		return false;
	}

	let owner = pickedObject['id']['entityCollection']['_owner']['_name']

	switch(owner){
		case 'lgas':
		case 'stateDivisions':
		case 'federal':
		case 'zones':
		case 'broadcast':
		
		case 'localities':

		$('.tooltip').html(`<span>${pickedObject['id']['_label']['_text']['_value']}</span>`).removeClass('displayNone');
		
		// pickedObject.id.label.show = true;
		// window['hover'] = pickedObject;

		// let cartesian = viewer.camera.pickEllipsoid(movement.endPosition,viewer.scene.globe.ellipsoid);
		// let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
		// let longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
		// let latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);
		// hoverLabel.position = cartesian;
		// hoverLabel.label.show = true;
		// hoverLabel.label.text = pickedObject['id']['_label']['_text']['_value'];
		
		break;

		// default: return false;
		// default: hoverLabel.label.show = false; break;
		default: $('.tooltip').html('').addClass('displayNone'); break;
	}
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);*/
/*H*O*V*E*R*/
let polygons = []
/*FUNCTIONS*/
viewer.trackedEntityChanged.addEventListener((e)=>{
	// console.log(e)
})
viewer.selectedEntityChanged.addEventListener((e)=>{
	// console.log(e)
	viewer.trackedEntity = undefined;

	/*alpha channel*/
	console.log(polygons)
	if(window['polygons'] != undefined){//there is an array of polygons in memory

		for(let i in window['polygons']){console.log(i)
			let p = window['polygons'][i]
			let rgba = p['_polygon']['_material']['_color']['_value']
			let R = rgba['red']
			let G = rgba['green']
			let B = rgba['blue']
			let nc = new Cesium.Color(R,G,B,0.25)
			p.polygon.material = nc
			p.polygon.outline = false
		}
	}
	/*alpha channel*/
	
	if(e == undefined){//clicked out of polygon or cleared selection
		let b = stateBox[$('.stateSelect').val()];
		// console.log(b)
		$('.areaFocus').val('clear')
		viewer.camera.flyTo({
			destination : Cesium.Rectangle.fromDegrees(b[0],b[1],b[2],b[3])
		});
		return false
	}else{
		/*selection indicator*/
		switch(!e['_polygon']){//selected entity is a point or label
			case false: $('.cesium-viewer-selectionIndicatorContainer').addClass('displayNone'); break;
			case true:
			setTimeout(()=>{
				$('.cesium-viewer-selectionIndicatorContainer').removeClass('displayNone')
			},250);
			break;
		}
		/*selection indicator*/

		let id = e['_id']
		let name = e['_name']
		let owner = e['entityCollection']['_owner']['_name']
		// let entGroup = guidSelect[owner][e['entGroup']]
		let entGroup = guidSelect[owner]//[id['entGroup']]
		
		// console.log(guidSelect)
		// console.log(id)
		
		// console.log(id)
		// console.warn(name)
		
		// console.warn(owner)
		// console.log(id)
		// console.log(entGroup)
	console.log('aaa')	

		switch(owner){

			case 'stateBoundaries':

			let prevVal = $('.stateSelect').val()

			if($('.stateSelect').val() != name){
				$('.stateSelect').val(name);
			}
			
			viewer.selectedEntity = undefined;
			viewer.trackedEntity = undefined;
			
			if(prevVal != name){
				stateSelect(name)
			}

			// break;

			// case 'lgas':
			// case 'stateDivisions':
			// case 'federal':
			// case 'zones':
			// case 'broadcast':
		
			// $('.areaFocus').val(entGroup[0])
			// // e.label.show = false
			// let b = e['_boundingBox']

			/*alpha channel*/
			let rgba = e['_polygon']['_material']['_color']['_value']
			let R = rgba['red']
			let G = rgba['green']
			let B = rgba['blue']
			let nc = new Cesium.Color(R,G,B,0.5)

			window['polygons'] = []

			console.log(currentEntities)
			console.log(entGroup)
		
			for(let i in entGroup){

				console.warn(i)
				// console.log(currentEntities[entGroup][i])
				// let p = window['currentEntities'][entGroup[i]]
				// let p = currentEntities[entGroup[i]]
				// let p = currentEntities[entGroup][i]
				// let p = entGroup[i]
				let p = currentEntities[i]

				console.log(p)
				// window['polygons'].push(p)
				
				polygons.push(p)
				
				p.polygon.material = nc
				p.polygon.outline = true
			}
			/*alpha channel*/
			// console.log(polygons)
			// viewer.camera.flyTo({
			// 	destination : Cesium.Rectangle.fromDegrees(b['W'],b['S'],b['E'],b['N'])
			// });

			break;		
		}
	}
})

const toTitleCase = (str)=>{
	return str.replace(
		/\w\S*/g,
		(txt)=>{
			// return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			return (txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()).replace(/Mcc/g,'McC').replace(/O'c/,`O'C`);
		}
	);
}

const wordWrap = (str)=>{

	str = toTitleCase(str)

	let words = str.split(' ')
	let len = words.length
	let out;

	if(len > 1){

		let parity = len % 2;

		let lo = Math.floor(len / 2) - 1;
		let hi = Math.ceil(len / 2) - 1;

		let a = words[0]
		let aa = words[0]
		let b = '';
		let bb = '';

		for(let i = 1; i < len; i++){

			if(i <= lo){
				a += ` ${words[i]}`
				aa += ` ${words[i]}`
			}
			if(i == hi && parity == 1){
				aa += ` ${words[i]}`
				bb += `${words[i]}`
			}
			if(i > hi){
				b += ` ${words[i]}`
				bb += ` ${words[i]}`
			}
		}

		if(Math.abs(a.length - bb.length) < Math.abs(aa.length - b.length)){
			out = `${a}\n${bb}`;
		}else{
			out = `${aa}\n${b}`;
		}
	}else{
		// console.log(toTitleCase(str))
		return toTitleCase(str)
	}

	return out.replace(/\n /g,'\n')
}

const numberWithCommas = (x)=>{
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const decimalise = (val,dec)=>{	
	let multiplier = Number(`1e${dec}`)
	let result = Math.round(Number(val) * multiplier) / multiplier
	return numberWithCommas(result)
}

// const listSelections = (a)=>{

// 	if($(`.areaSelect option[value="${window['selectedArea']}"]`).prop('disabled') == true){
// 		$('.areaSelect').val('clear');
// 		$('.areaFocus').prop('disabled',true).val('clear');
// 		$('#dynamicOption').html('Select Division');
// 		return false;
// 	}

// 	if(a === null || a == 'clear' || a == 'deselect'){
// 		$('.areaSelect').prop('disabled',false);
// 		$('.areaFocus').prop('disabled',true).val('clear');//
// 	}else{
	
// 		let s = Object.keys(selections[a]).sort();
// 		let d;

// 		switch(a){
// 			case 'lgas': d = 'LGA'; break;
// 			case 'stateDivisions':d = 'Electorate'; break;
// 			case 'federal':d = 'Electorate'; break;
// 			case 'zones':d = 'Zone'; break;
// 		}

// 		$('.areaFocus').html(`
// 			<option selected hidden value="clear" id="dynamicOption">Select ${d}</option>
// 			<option value="deselect" id="clearAreaSelection">None</option>
// 		`)
		
// 		for(let i in s){
// 			// console.log(s[i])
// 			$('.areaFocus').append(`<option value="${selections[a][s[i]][0]}">${toTitleCase(s[i])}</option>`)
// 		}

// 		$('.areaSelect, .areaFocus').prop('disabled',false);
// 	}
// };

/*ENTITY FUNCTIONS*/
const loadCountries = ()=>{
	
	let info = fetch(`script/countries.json`,{
		method: 'get',
		headers: {'Content-Type': 'application/json'}
	})
	.then((response) => response.json())
	.then((response) => {
		
		let entGroup
		let o = response['features'];
		let thisName = o[0]['properties']['name']
		// console.log(thisName)

		for(let i in o){

			// console.log(o)

			let id = o[i]['properties']['name']
			let coords = o[i]['geometry']['coordinates'][0]
			let boundary = []
// console.log(id)
			let r = countryColours[id][0] / 255;
			let g = countryColours[id][1] / 255;
			let b = countryColours[id][2] / 255;

			let colour = new Cesium.Color(r,g,b,0.5);
			// let colour = new Cesium.Color(r,g,b,1);

			for(let i in coords){
				boundary.push(coords[i][0],coords[i][1])
			}

			// let guid
			// let entGroup

			if(thisName !== id || i == 0){

				stateBoundaries.entities.add({
					name: id,
					polygon: {
						hierarchy: Cesium.Cartesian3.fromDegreesArray(boundary),
						height : 0,
						material : colour,
						outline : false,
						outlineColor : Cesium.Color.BLACK,
					}
				})

				// let guid = stateBoundaries['_entityCollection']['_entities']['_array'][i]['_id']
				let guid = stateBoundaries['_entityCollection']['_entities']['_array'][i]['_id']
				entGroup = guid//defined at first polygon in the group
				guidSelect['stateBoundaries'][entGroup] = []

				// console.log(thisName)
				// console.log(guid)
				// console.log(entGroup)
				// console.log(stateBoundaries['_entityCollection']['_entities'])
				// console.warn(stateBoundaries['_entityCollection']['_entities']['_array'])
				// console.log('')

				// console.log(guidSelect['stateBoundaries'])

				// window['currentEntities'][guid] = stateBoundaries['_entityCollection']['_entities']['_array'][i]
				

				currentEntities[guid] = stateBoundaries['_entityCollection']['_entities']['_array'][i]

				guidSelect['stateBoundaries'][entGroup].push(guid)//store unique id in an array to loop over
				// selections['stateBoundaries'][id].push(guid)

				thisName = id;
			}else{

				// currentEntities[guid] = stateBoundaries['_entityCollection']['_entities']['_array'][i]

				// let guid = stateBoundaries['_entityCollection']['_entities']['_array'][0]['_id']
				
				// console.log(stateBoundaries['_entityCollection']['_entities']['_array'][i]['_id'])
				// entGroup = guid//defined at first polygon in the group
				// guidSelect['stateBoundaries'][entGroup].push(guid)//store unique id in an array to loop over

				// console.log(i,entGroup)
				// console.log('')

				stateBoundaries.entities.add({
					name: id,
					polygon: {
						hierarchy: Cesium.Cartesian3.fromDegreesArray(boundary),
						height : 0,
						material : colour,
						outline : false,
						outlineColor : Cesium.Color.BLACK,
						entGroup:entGroup//add the entGroup attribute to the entity
					}
				})

				// console.log(stateBoundaries['_entityCollection']['_entities']['_array'][i]['_id'])

				let guid = stateBoundaries['_entityCollection']['_entities']['_array'][i]['_id']
				guidSelect['stateBoundaries'][entGroup].push(guid)//store unique id in an array to loop over

				// console.log(stateBoundaries.entities)
			}

		}

		console.log(guidSelect)
	})
	.catch(err => console.error('Caught error: ', err))
}
loadCountries();
/*ENTITY FUNCTIONS*/
let currentEntities = {}
const stateSelect = (e)=>{
	
	let v;
	if(e.type == 'change'){
		v = e.target.value;
	}else{
		v = e;
	}

	let b = stateBox[v];
	
	// window['currentEntities'] = {};
	currentEntities = {};

	// stateDivisions.entities.removeAll();

	// selections['stateDivisions'] = {}

	// guidSelect['stateDivisions'] = {}

	if(v === 'all'){
		e.target.value = 'clear';
		$('#clearStateSelection').html('All')
		$('.areaSelect').prop('disabled',true);
		$('.areaFocus').prop('disabled',true).val('clear');//
		// $('option[value="AUS"]').prop('disabled',true);
		stateBoundaries.show = true;
	}else{
		// $('option[value="AUS"]').prop('disabled',false);
		$('#clearStateSelection').html('Clear Selection')
	}

	viewer.camera.flyTo({
		destination : Cesium.Rectangle.fromDegrees(b[0],b[1],b[2],b[3])
	});
}

/*FUNCTIONS*/

/*DOM*/
$('.cesium-viewer-toolbar').append(`

	<select class="cesium-button stateSelect" name="state" id="state">
		<option hidden selected value="clear">Select Country</option>
		<option value="all" id="clearStateSelection">All</option>
		
		<option value="Indonesia">Indonesia</option>
		<option value="Malaysia">Malaysia</option>
		<option value="Vietnam">Vietnam</option>
		<option value="Cambodia">Cambodia</option>
		<option value="Laos">Laos</option>
		<option value="Thailand">Thailand</option>
		<option value="Brunei">Brunei</option>
		<option value="Myanmar">Myanmar</option>
		<option value="The Philippines">The Philippines</option>
		<option value="Singapore">Singapore</option>
	</select>
`)
/*DOM*/

/*BINDINGS*/
$('.stateSelect').change(stateSelect);


$(window).keyup((e)=>{
	if(e.keyCode == 27){
		viewer.trackedEntity = undefined;
		viewer.selectedEntity = undefined;
	}
})
/*BINDINGS*/