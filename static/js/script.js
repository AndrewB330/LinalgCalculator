var width = 3;
var height = 3;
var max_size = 9;
var data = zero_matrix(max_size, max_size);
var result = zero_matrix(max_size, max_size);

var calculator = 'inverse';
var output_type = 'matrix-square';

var color_main_1 = '#FFFFFF';
var color_main_2 = '#F9F9F9';
var color_disabled = '#EEEEEE';
var color_special = '#BBFF99';

var colorizer = function(i,j){return (i<height && j<width?((i+j)%2==0?color_main_1:color_main_2):color_disabled);}

function zero_matrix(width, height) {
    var data = [], row = [];
    for (var i = 0; i < width;i++) row.push(0);
    for (var i = 0; i < height;i++) data.push(row.slice());
    return data;
}

window.onload = function () {
	select_calculator(calculator, output_type);
    set_size(3, 3);
}

function set_size(nwidth, nheight) {
	if (nwidth > max_size || nwidth < 1 || nheight > max_size || nheight < 1)
        return;
	width = nwidth;
	height = nheight;
	rebuild_matrix();
    set_matrix("output-matrix",zero_matrix(max_size, max_size));
    $("#size").empty().append(width+"x"+height);
    $("#size-width").empty().append(width);
    $("#size-height").empty().append(height);
}

function change_size(diff_widtn, diff_height) {
    set_size(width + diff_widtn, height+diff_height);
}

function getId(i,j) {
    return id = 'A-'+i+'-'+j;
}

function identity() {
    for(var i = 0; i < max_size; i++)
    {
		for(var j = 0; j < max_size; j++)
        {
			data[i][j] = (i==j?1:0) ;
        }
	}		
    rebuild_matrix();
}

function random() {
	for(var i = 0; i < max_size; i++)
	{
		for(var j = 0; j < max_size; j++)
        {
            data[i][j] = Math.floor((Math.random() * 10) - 5); 
        }    
	}
    rebuild_matrix();
}

function fill(val) {
    for(var i = 0; i < max_size; i++)
        for(var j = 0; j < max_size; j++)
            data[i][j] = val;
    rebuild_matrix();
}

function enabled(i,j) {
	return i<height && j<width;
}

function variables_row()
{
	var row = '';
	row += '<tr>';
	for (var j = 0; j < max_size; j++)
	{
		row += '<td>';
		row += '<div class="matrix-cell output" >'+(j<width-1?'x'+(j+1):(j==width-1?'C':''))+'</div>';
		row += '</td>';
	}
	row += '</tr>';
	return row;
}

function rebuild_matrix() {
    $("#message").empty();
    var content = ''
	if (calculator == 'gauss') content+=variables_row();
    for(var i = 0; i < max_size; i++)
    {
        content += '<tr>';
        for(var j = 0; j < max_size; j++)
        {
            content += '<td>';
            content += '<input style="background-color:'+colorizer(i,j)+'" class="matrix-cell" id="'+getId(i,j)+'" value="'+(enabled(i,j)?data[i][j]:0)+'" '+(enabled(i,j)?'':'disabled')+'/>';
            content += '</td>';
        }
        content += '</tr>';
    }
    $('#input-matrix').empty().append(content);
    $("#input-matrix").on('mouseup','.matrix-cell', function() { $(this).select(); });
    $("#input-matrix").on('change','.matrix-cell', function() { 
        var splitted = $(this).attr("id").split("-");
        data[parseInt(splitted[1])][parseInt(splitted[2])] = $(this).val();
    });
}

function format_fraction(x) {
	if (x.indexOf('/') == -1)
		return x;
	var num = x.split('/')[0];
	var den = x.split('/')[1];
	return '<div class="numerator">'+num+'</div><div class="denominator">'+den+'</div>';
}

function set_matrix(id,data) {
	result = data;
    var content = '';
	if (calculator == 'gauss') content+=variables_row();
    for(var i = 0; i < max_size; i++)
    {
        content += '<tr>';
        for(var j = 0; j < max_size; j++)
        {
            content += '<td>';
            if (enabled(i,j) && data[i][j]!=0)
                content += '<a style="background-color:'+colorizer(i,j)+'" class="matrix-cell output '+(enabled(i,j)?'enabled':'disabled')+'" >'+format_fraction(data[i][j])+'</a>';
            else
                content += '<a style="background-color:'+colorizer(i,j)+'" class="matrix-cell output zero '+(enabled(i,j)?'enabled':'disabled')+'" >0</a>';
            content += '</td>';
        }
        content += '</tr>';
    }
    $('#'+id).empty().append(content);
}

function copy_data() {
	var m = zero_matrix(width, height);
	for (var i = 0; i < height; i++)
		for (var j = 0; j < width; j++)
			m[i][j] = data[i][j];
	window.prompt("Copy to clipboard: Ctrl+C, Enter", JSON.stringify(m).split('],').join('],\n'));
}

function copy_result() {
	var m = zero_matrix(width, height);
	for (var i = 0; i < height; i++)
		for (var j = 0; j < width; j++)
			m[i][j] = result[i][j];
	window.prompt("Copy to clipboard: Ctrl+C, Enter", JSON.stringify(m).split('],').join('],\n'));
}

function paste() {
	var m = JSON.parse(window.prompt('Paste Ctrl+V, Enter','[[0]]'));
	var nheight = m.length;
	var nwidth = m[0].length;
	var matrix = zero_matrix(max_size, max_size);
	for(var i = 0; i < nheight;i++)
		for(var j = 0; j < nwidth;j++)
			matrix[i][j] = m[i][j];
	data = matrix;
	set_size(nwidth, nheight);
}

function set_status(ok)
{
    if (ok)
        $("#message").css({color:"#494"});
    else
        $("#message").css({color:"#944"});
}

function sample1()
{
    set_size(4, 4);
    fill(0);
    x = [[0,1,0,0],[11,6,-4,-4],[22,15,-8,-9],[-3,-2,1,2]];
    for(var i = 0; i < height;i++)
        for(var j = 0; j < width;j++)
            data[i][j] = x[i][j];
    rebuild_matrix();
}

function sample2()
{
	set_size(6, 6);
    fill(0);
    x = [[-2,0,0,0,1,0],[0,2,1,0,0,2],[0,0,2,1,0,0],[1,0,0,2,2,0],[0,0,0,0,-3,1],[0,0,0,0,0,-3]];
    for(var i = 0; i < height;i++)
        for(var j = 0; j < width;j++)
            data[i][j] = x[i][j];
    rebuild_matrix();
}

function calculate()
{
    set_status(true);
    $("#message").empty().append("Calculation...");
    var subdata = []
    for(var i = 0; i < height;i++)
        subdata.push(data[i].slice(0,width));
    $.getJSON('/calculate_' + calculator, {
          "matrix": subdata,
          "width": width,
		  "height": height
    }, function(data) {
		if (output_type == 'matrix-square' || output_type == 'matrix-rectangle')
        {
			set_matrix("output-matrix",data.matrix);
			$("#message").empty().append(data.message);
		}
		if (output_type == 'number')
		{
			$("#output-number").html(data.prefix + data.result);
			$("#message").empty().append(data.message);
		}
        set_status(data.ok);
    });
}

function first_letter_color(text, color) {
	return '<span class="first-char">' + text[0] + '</span>' + text.slice(1);
}


function select_calculator(ncalculator, noutput_type) {
	output_type = noutput_type;
	calculator = ncalculator;
	
    var tabs = document.getElementsByClassName("nav-tab");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].className = tabs[i].className.replace(' active','');
    }
    document.getElementById(calculator).className += ' active'
	
	if (output_type == 'matrix-square')
	{
		$('#output').empty().append(
		'Output matrix:<table id="output-matrix" class="matrix"></table><button class="white-button control" onclick="copy_result()">Copy</button>'
		);
		$('#size-square').show();
		$('#size-rectangle').hide();
		set_size(width, width);
	}
	if (output_type == 'matrix-rectangle')
	{
		$('#output').empty().append(
		'Output matrix:<table id="output-matrix" class="matrix"></table><button class="white-button control" onclick="copy_result()">Copy</button>'
		);
		$('#size-square').hide();
		$('#size-rectangle').show();
		set_size(width, height);
	}
	if (output_type == 'number')
	{
		$('#output').empty().append(
		'Result:<div id="output-number" class="number">???</div>'
		);
	}
	if (calculator == 'determinant')
		$('#calculator-name').empty().append(first_letter_color('Determinant calculator'));
	if (calculator == 'jordan')
		$('#calculator-name').empty().append(first_letter_color('Jordan normal form calculator'));
	if (calculator == 'inverse')
		$('#calculator-name').empty().append(first_letter_color('Inverse matrix calculator'));
	if (calculator == 'gauss')
		$('#calculator-name').empty().append(first_letter_color('System of linear equations calculator'));
	
	
	if (calculator == 'gauss')
		colorizer = function(i,j){return (i<height && j<width?(j==width-1?color_special:((i+j)%2==0?color_main_1:color_main_2)):color_disabled);}
	else 
		colorizer = function(i,j){return (i<height && j<width?((i+j)%2==0?color_main_1:color_main_2):color_disabled);}
	
	set_size(width, height);
}