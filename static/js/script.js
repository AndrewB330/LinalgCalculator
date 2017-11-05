var size = 3;
var max_size = 9;
var data = zero_matrix(max_size);
var result = zero_matrix(max_size);

function zero_matrix(size) {
    var data = [], row = [];
    for (var i = 0; i < size;i++) row.push(0);
    for (var i = 0; i < size;i++) data.push(row.slice());
    return data;
}

window.onload = function () {
    resize_input(0);
}

function resize_input(diff) {
    if (size+diff > max_size || size+diff<1)
        return;
    size += diff;
    rebuild_matrix();
    set_matrix("output-matrix",zero_matrix(size));
    $("#size").empty().append(size+"x"+size);
}

function getId(i,j) {
    return id = 'A-'+i+'-'+j;
}

function identity() {
    for(var i = 0; i < max_size; i++)
        for(var j = 0; j < max_size; j++)
        {
            if (i!=j) 
                data[i][j] = 0; 
            else 
                data[i][j] = 1;
        }    
    rebuild_matrix();
}

function random() {
	for(var i = 0; i < max_size; i++)
        for(var j = 0; j < max_size; j++)
        {
            data[i][j] = Math.floor((Math.random() * 30) - 15); 
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
	return i<size && j<size;
}

function rebuild_matrix() {
    $("#message").empty();
    var content = ''
    for(var i = 0; i < max_size; i++)
    {
        content += '<tr>';
        for(var j = 0; j < max_size; j++)
        {
            content += '<td>';
            content += '<input class="matrix-cell '+(enabled(i,j)?'enabled':'disabled')+'" id="'+getId(i,j)+'" value="'+(enabled(i,j)?data[i][j]:0)+'" '+(i<size && j<size?'':'disabled')+'/>';
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

function set_matrix(id,data) {
	result = data;
    var content = ''
    for(var i = 0; i < max_size; i++)
    {
        content += '<tr>';
        for(var j = 0; j < max_size; j++)
        {
            content += '<td>';
            if (enabled(i,j) && data[i][j]!=0)
                content += '<a class="matrix-cell output '+(enabled(i,j)?'enabled':'disabled')+'" >'+data[i][j]+'</a>';
            else
                content += '<a class="matrix-cell output zero '+(enabled(i,j)?'enabled':'disabled')+'" >0</a>';
            content += '</td>';
        }
        content += '</tr>';
    }
    $('#'+id).empty().append(content);
}

function copy_data() {
	var m = zero_matrix(size);
	for (var i = 0; i < size; i++)
		for (var j = 0; j < size; j++)
			m[i][j] = data[i][j];
	window.prompt("Copy to clipboard: Ctrl+C, Enter", JSON.stringify(m));
}

function copy_result() {
	var m = zero_matrix(size);
	for (var i = 0; i < size; i++)
		for (var j = 0; j < size; j++)
			m[i][j] = result[i][j];
	window.prompt("Copy to clipboard: Ctrl+C, Enter", JSON.stringify(m));
}

function paste() {
	var m = JSON.parse(window.prompt('Paste Ctrl+V, Enter','[[0]]'));
	var nsize = m.length;
	var matrix = zero_matrix(max_size);
	for(var i = 0; i < nsize;i++)
		for(var j = 0; j < nsize;j++)
			matrix[i][j] = m[i][j];
	diff = nsize - size;
	data = matrix;
	resize_input(diff);
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
    resize_input(4-size);
    fill(0);
    x = [[0,1,0,0],[11,6,-4,-4],[22,15,-8,-9],[-3,-2,1,2]];
    for(var i = 0; i < size;i++)
        for(var j = 0; j < size;j++)
            data[i][j] = x[i][j];
    rebuild_matrix();
}

function sample2()
{
	resize_input(6-size);
    fill(0);
    x = [[-2,0,0,0,1,0],[0,2,1,0,0,2],[0,0,2,1,0,0],[1,0,0,2,2,0],[0,0,0,0,-3,1],[0,0,0,0,0,-3]];
    for(var i = 0; i < size;i++)
        for(var j = 0; j < size;j++)
            data[i][j] = x[i][j];
    rebuild_matrix();
}

function calculate_matrix(type)
{
    set_status(true);
    $("#message").empty().append("Calculation...");
    var subdata = []
    for(var i = 0; i < size;i++)
        subdata.push(data[i].slice(0,size));
    $.getJSON(type, {
          "matrix": subdata,
          "size": size
    }, function(data) {
        set_matrix("output-matrix",data.matrix);
        $("#message").empty().append(data.message);
        set_status(data.ok);
    });
}

function calculate_number()
{
    set_status(true);
    $("#message").empty().append("Calculation...");
    var subdata = []
    for(var i = 0; i < size;i++)
        subdata.push(data[i].slice(0,size));
    $.getJSON('/calculate_determinant', {
          "matrix": subdata,
          "size": size
    }, function(data) {
		$("#output-number").html('Det = ' + data.result);
        $("#message").empty().append(data.message);
        set_status(data.ok);
    });
}