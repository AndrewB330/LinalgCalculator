var size = 3;
var max_size = 9;
var data = zero_matrix(max_size);

function zero_matrix(size) {
    var data = [], row = [];
    for (var i = 0; i < max_size;i++) row.push(0);
    for (var i = 0; i < max_size;i++) data.push(row.slice());
    return data;
}

window.onload = function () {
    resize_input(0)
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

function fill(val) {
    for(var i = 0; i < max_size; i++)
        for(var j = 0; j < max_size; j++)
            data[i][j] = val;
    rebuild_matrix();
}

function rebuild_matrix() {
    $("#message").empty();
    var content = ''
    for(var i = 0; i < size; i++)
    {
        content += '<tr>';
        for(var j = 0; j < size; j++)
        {
            content += '<td>';
            content += '<input class="matrix-cell" id="'+getId(i,j)+'" value="'+data[i][j]+'"/>';
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
    var content = ''
    for(var i = 0; i < size; i++)
    {
        content += '<tr>';
        for(var j = 0; j < size; j++)
        {
            content += '<td>';
            if (data[i][j]!=0)
                content += '<a class="matrix-cell output" >'+data[i][j]+'</a>';
            else
                content += '<a class="matrix-cell output zero" >'+data[i][j]+'</a>';
            content += '</td>';
        }
        content += '</tr>';
    }
    $('#'+id).empty().append(content);
}

function set_status(ok)
{
    if (ok)
        $("#message").css({color:"#494"});
    else
        $("#message").css({color:"#944"});
}

function sample()
{
    resize_input(4-size);
    fill(0);
    x = [[0,1,0,0],[11,6,-4,-4],[22,15,-8,-9],[-3,-2,1,2]];
    for(var i = 0; i < size;i++)
        for(var j = 0; j < size;j++)
            data[i][j] = x[i][j];
    rebuild_matrix();
}

function calculate()
{
    set_status(true);
    $("#message").empty().append("Calculation...");
    var subdata = []
    for(var i = 0; i < size;i++)
        subdata.push(data[i].slice(0,size));
    $.getJSON('/calculate', {
          "matrix": subdata,
          "size": size
    }, function(data) {
        set_matrix("output-matrix",data.matrix);
        $("#message").empty().append(data.message);
        set_status(data.ok);
    });
}