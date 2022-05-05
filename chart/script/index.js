google.charts.load('current');

const init = (url)=>{
	let query = new google.visualization.Query(url);
	query.setQuery('select A, B');
	query.send(processSheetsData);
}

const processSheetsData = (response)=>{

	window['array'] = []

	let data = response.getDataTable();
	let columns = data.getNumberOfColumns();
	let rows = data.getNumberOfRows();
	
	for (let r = 0; r < rows; r++) {//r = current row
		
		let row = [];
		
		for (let c = 0; c < columns; c++) {//c = current column
			row.push(data.getFormattedValue(r, c));
		}

		array.push({
			name: row[0],
			value: +row[1],
		});
	}
	column_chart(array)
}

const round_up = (n)=>{

	let len = n.toString().length
	let first = Number(n.toString()[0])
	let step = 10;

	if(first < 5){
		step = 5;
	}

	let up = Number(step.toString().padEnd(len - 1, 0))

	return Math.floor(n / up) * up + up
}

const numberWithCommas = (n)=>{
	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const abbreviateNumber = (value)=>{
	//https://stackoverflow.com/questions/10599933/convert-long-number-into-abbreviated-string-in-javascript-with-a-special-shortn
	let newValue = value;
	
	if (value >= 1000) {
	
		let suffixes = ["", "k", "m", "b","t"];
		let suffixNum = Math.floor( (""+value).length/3 );
		let shortValue = '';
	
		for (let precision = 2; precision >= 1; precision--) {
			shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
			let dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
			if (dotLessShortValue.length <= 2) { break; }
		}
	
		if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
		newValue = shortValue+suffixes[suffixNum];
	}
	return newValue;
}

let outer_width = 790
let outer_height = 380

let margin = {
	top: 60,
	right: 20,
	bottom: 50,
	left: 40
};

let vertical_difference = outer_height - margin.bottom;

let padding = {
	top: 0,
	right: 0,
	bottom: 0,
	left: 0
}

let tilt = {
	x:'-0.4em',
	y:'0.4em',
	anchor:'end',
	deg: 45,
}

let chartname = 'chart_'

const inputFields = d3.selectAll('.inputFields').style('width',`${outer_width}px`)
// const chartFrame = d3.select('#chartFrame').style('width',`${outer_width}px`).style('height',`${outer_height}px`)

const column_chart = (data)=>{
	console.log(outer_height,margin.bottom,vertical_difference)
	let width = outer_width - margin.left - margin.right - padding.left - padding.right;
	let height = outer_height - margin.top - margin.bottom - padding.top - padding.bottom;

	let d = data;
	let max = 0;

	for(i of data){
		if(i['value'] >= max){
			max = i['value']
		}
	}

	const xScale = d3
		.scaleBand()
		.domain(d.map((dataPoint) => dataPoint.name))
		.rangeRound([0,width])
		.padding(0.1);

	const yScale = d3
		.scaleLinear()
		.domain([0, d3.max(data, (d) => d.value)])
		// .domain([0, round_up(d3.max(data, (d) => d.value))])
		.nice()
		.range([height,0]);

	const container = d3.select('#chart')
		.classed('container',true)
		.style('font-family','gilroyregular')
		.attr('width',width + margin.left + margin.right + padding.left + padding.right)
		.attr('height',height + margin.top + margin.bottom + padding.top + padding.bottom)
		.attr('y',(margin.top - margin.bottom) / 2)
		.attr("viewBox", [
			-margin.left -padding.left,
			-(margin.top - margin.bottom) / 2,
			 width + margin.left + margin.right + padding.left + padding.right,
			 height
		])//

		.style("background", "#fff")
		
	const chartFrameInner = d3.select('#chartFrameInner')
		.style('margin-top', `${-padding.top}px`)
		.style('margin-left', `${-padding.left}px`)

	const clear_chart = container.selectAll('*').remove();

	const _title = container
		.selectAll('.title')
		.data([{}])
		.enter()
		.append('text')
		.text(title.property('value'))
		.classed('title',true)
		.attr('font-size','1.2em')
		.attr('x', 10 - margin.left)
		.attr('y',-margin.top + 28)

	const _source = container
		.selectAll('.source')
		.data([{}])
		.enter()
		.append('text')
		.text(()=>{
			if(source.property('value') != ''){
				return `source: ${source.property('value')}`
			}
		})
		.classed('source',true)
		.attr('font-size','0.8em')
		.attr('x',width)
		.attr('y',-margin.top + 28)
		.attr('text-anchor','end')
		.attr('fill','#777777')

	const chart = container.append('g')

	const bars = chart
		.selectAll('.bar')
		.data(d, data => data)
		.enter()//check for what's not there yet
		.append('rect')//standard svg element
		.classed(`bar`,true)
		.attr('fill','#de2508')
		.attr('width', xScale.bandwidth())
		.attr('height', data => height - yScale(data.value))
		.attr('x', data => xScale(data.name))
		.attr('y', data => yScale(data.value))

	const labels = chart
		.selectAll('.label')
		.data(d, data => data)
		.enter()
		.append('text')
		// .text(data => (data.value))
		// .text(data => (abbreviateNumber(data.value)))
		.text(data => (numberWithCommas(data.value)))
		.attr('x', (data => xScale(data.name) + (xScale.bandwidth() / 2)))
		.attr('y', data => yScale(data.value) - 10)
		.attr('text-anchor','middle')
		.classed('label',true)

	const axisX = chart.append('g')
		.call(d3.axisBottom(xScale).tickSizeOuter(0))
		.attr('font-family','gilroyregular')
		.attr('font-size','0.8em')
		.attr('transform',`translate(0,${height})`)
		.classed('axisX',true)
		.selectAll("text")
			.attr("x",`${tilt.x}`)
			.attr("y",`${tilt.y}`)
			.attr("text-anchor", `${tilt.anchor}`)
			.attr("transform", `rotate(-${tilt.deg})`)

	const yAxisTicks = yScale.ticks()
		.filter(tick => Number.isInteger(tick))

	const axisY = chart.append('g')
		.call(
			d3
			.axisLeft(yScale)
			.tickValues(yAxisTicks)
			.tickFormat((d,i)=>{
				return abbreviateNumber(d)
			})
		)
		.attr('font-family','gilroyregular')
		.attr('font-size','0.8em')
		.classed('axisY',true)
};

/*input functions*/

let shift = false;

d3.select('*').on('keydown keyup',(e)=>{
	shift = e.shiftKey;
})

const title = d3
	.select('#title')
	.on('change keyup focus blur',(e)=>{
		
		let t = e.type;
		let v = e.target.value

		switch(t){
			
			case 'keyup':
			case 'change':
			if(v != ''){
				chartname = `${v.replace(/ /g,'_')}_`
			}else{
				chartname = 'chart_'
			}
			d3.select('.title').text(v);
			break;

			case 'focus':
			e.target.select();
			break;
		}
	})

const source = d3
	.select('#source')
	.on('change keyup focus blur',(e)=>{
		
		let t = e.type;
		let v = e.target.value

		switch(t){
			
			case 'keyup':
			case 'change':
			if(v != ''){
				d3.select('.source').text(`source: ${v}`);
			}else{
				d3.select('.source').text('');
			}
			break;

			case 'focus':
			e.target.select();
			break;
		}
	})

const sheetLink = d3.select('#sheetLink')
const newSheet = d3.select('#newSheet')

const address = d3
	.select('#address')
	.on('change keyup focus blur',(e)=>{
		
		let t = e.type;
		let v = e.target.value
		
		switch(t){
			
			// case 'keyup':
			case 'change':
			
			if(typeof(Storage) != undefined){
				localStorage.setItem('url',v)
			}

			if(v != ''){
				sheetLink.property('href',v).classed('displayNone',false);
				newSheet.classed('displayNone',true);
				reload.property('disabled',false);
				init(v);	
			}else{
				sheetLink.classed('displayNone',true);
				newSheet.classed('displayNone',false);
				reload.property('disabled',true);
			}

			e.target.blur()
			break;
			
			case 'focus':
			e.target.select();
			break;
			// case 'blur': alert('BLUR!'); break;
		}
	})

const axialTilt = d3
	.selectAll('input[name="axialTilt"]')
	.on('change',(e)=>{
		let v = +e.target.value;

		switch(v){
			case 0:
			tilt = {
				x:'0',
				y:'0.8em',
				anchor:'middle',
				deg:0
			}
			break;
			case 45:
			tilt = {
				x:'-0.4em',
				y:'0.4em',
				anchor:'end',
				deg:45
			}
			break;
			case 90:
			tilt = {
				x:'-0.8em',
				y:'-0.4em',
				anchor:'end',
				deg:90
			}
			break;
		}
		d3.selectAll('.axisX text')
			.attr("x",`${tilt.x}`)
			.attr("y",`${tilt.y}`)
			.attr("text-anchor", `${tilt.anchor}`)
			.attr("transform", `rotate(-${tilt.deg})`)
		;
	})

// const upDown = (target)=>{
// 	let v;
// 	switch(target){
// 		case 'heightAdjust':
// 		outer_height = +v
// 		case 'marginLeft':
// 		margin.left = +v
// 		case 'marginBottom':
// 		margin.bottom = +v
// 		case 'marginRight':
// 		margin.right = +v
// 		case 'marginTop':
// 		margin.top = +v
// 	}
// }

const marginInput = d3
	.selectAll('.marginInput')
	.on('change',(e)=>{

		let id = e.target.id;

		// let pv = e.target.data;console.log(pv)

		if(shift){
			// e.target.value = + e.target.value + 10;
		}

		let v = e.target.value;

		switch(id){
			case 'heightAdjust':
			outer_height = +v
			margin.bottom = outer_height - vertical_difference;
			document.getElementById('marginBottom').value = margin.bottom;
			break;
			case 'marginLeft':
			margin.left = +v
			break;
			case 'marginBottom':
			margin.bottom = +v
			vertical_difference = outer_height - margin.bottom;
			break;
			case 'marginRight':
			margin.right = +v
			break;
			case 'marginTop':
			margin.top = +v
			break;
		}

		column_chart(array)
	})

const reload = d3
	.select('#reload')
	.on('click',()=>{
		init(address.attr('value'))
	})

/*google charts function*/
google.charts.setOnLoadCallback(()=>{
	
	for(i of marginInput){
		switch(i.id){
			case 'heightAdjust':
			i.value = outer_height
			break;
			case 'marginLeft':
			i.value = margin.left
			break;
			case 'marginBottom':
			i.value = margin.bottom
			break;
			case 'marginRight':
			i.value = margin.right
			break;
			case 'marginTop':
			i.value = margin.top
			break;
		}
	}

	if(typeof(Storage) != undefined && localStorage['url']){
		let v = localStorage['url']
		address.attr('value',v);
		sheetLink.property('href',v).classed('displayNone',false);
		newSheet.classed('displayNone',true);
		reload.property('disabled',false);
		init(v)
	}else{
		address.node().focus();
		reload.property('disabled',true);
	}
});
