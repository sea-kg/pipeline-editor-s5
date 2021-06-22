

function export_to_json() {
    var _data_pl = {};
    for (i in data_pl) {
        _data_pl[i] = {}
        for (n in data_pl[i]) {
            if (n.startsWith("hidden_")) {
                _data_pl[i][n] = undefined;        
            } else {
                _data_pl[i][n] = data_pl[i][n];
            }
        }
    }
    return _data_pl;
}

function switch_ui_to_tab(_this, _callback) {
    var els = document.getElementsByClassName('pipeline-editor-tab');
    var active_id = _this.id;
    for (var i = 0; i < els.length; i++) {
        var tab_content_id = els[i].getAttribute('tab_content_id');
        if (els[i].id == active_id) {
            els[i].classList.add("active");
            document.getElementById(tab_content_id).style.display = 'block';
        } else {
            els[i].classList.remove("active");
            document.getElementById(tab_content_id).style.display = 'none';
        }
    }
    if (_callback) {
        _callback();
    }
}

function switch_draw_grid(el) {

    if (render.is_draw_grid) {
        render.is_draw_grid = false;
        el.classList.remove('draw-grid-enable')
        el.classList.add('draw-grid-disable')
    } else {
        render.is_draw_grid = true;
        el.classList.remove('draw-grid-disable')
        el.classList.add('draw-grid-enable')
    }
   
    render.update_pipeline_diagram();
}

function switch_to_tab_ui_editor(active_id) {
    data_pl = JSON.parse(json_content.value);
    render.update_meansures();
    render.update_pipeline_diagram();
}

function switch_to_tab_json() {
    var _data_pl = export_to_json();
    json_content.value = JSON.stringify(_data_pl, undefined, 4);
}

function switch_to_tab_export() {
    var _data_pl = export_to_json();
    json_content.value = JSON.stringify(_data_pl, undefined, 4);
}

function switch_to_tab_settings() {
    var _data_pl = export_to_json();
    json_content.value = JSON.stringify(_data_pl, undefined, 4);
}


function save_as_image() {
    const dataUrl = pipeline_diagram_canvas.toDataURL("png");
    var win = window.open();
    win.document.write('<iframe src="' + dataUrl  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen> </iframe>');
}

function save_to_localstorage() {
    var _data_pl = export_to_json();
    _data_pl = JSON.stringify(_data_pl, undefined, 4);
    localStorage.setItem('data_pl', _data_pl);
}

function random_makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function add_block() {
    var added = false;
    while (!added) {
        var new_id = random_makeid(7)
        if (!data_pl[new_id]) {
            data_pl[new_id] = {
                "name": "edit me",
                "description": "edit me",
                "incoming": {},
                "cell_x": 0,
                "cell_y": 0
            }
            added = true;
        }
    }
    render.update_meansures();
    render.update_pipeline_diagram();
}

function connect_blocks() {
    render.start_connect_blocks();
}


function resize_canvas() {
    console.log(window.innerWidth);

    var canvas_cont = document.getElementById('canvas_container')

    var left_panel = 60;
    var right_panel = 150;
    var paddings = 120;

    new_width = (window.innerWidth - left_panel - right_panel - paddings) + 'px';
    canvas_cont.style['max-width'] = new_width;
    canvas_cont.style['width'] = new_width;
    

    new_height = (window.innerHeight - 300) + 'px';
    canvas_cont.style['max-height'] = new_height;
    canvas_cont.style['height'] = new_height;
}

function input_onchangename() {
    var block_id = document.getElementById("prop_block_id").value;
    if (block_id) {
        console.log(document.getElementById("prop_name").value);
        data_pl[block_id]['name'] = document.getElementById("prop_name").value;
        data_pl[block_id]['description'] = document.getElementById("prop_description").value;
        render.update_meansures();
        render.update_pipeline_diagram();
    }
}

function render_onchoosedelement(block_id) {
    if (block_id) {
        document.getElementById("prop_block_id").value = block_id;
        document.getElementById("prop_name").value = data_pl[block_id]['name'];
        document.getElementById("prop_name").removeAttribute('readonly');
        document.getElementById("prop_description").value = data_pl[block_id]['description'];
        document.getElementById("prop_description").removeAttribute('readonly');
    } else {
        document.getElementById("prop_block_id").value = "";
        document.getElementById("prop_name").value = "";
        document.getElementById("prop_name").setAttribute('readonly', true);
        document.getElementById("prop_description").value = "";
        document.getElementById("prop_description").setAttribute('readonly', true);
    }
}


document.addEventListener("DOMContentLoaded", function() {
    var _data_pl = localStorage.getItem('data_pl')
    if (_data_pl) {
        data_pl = JSON.parse(_data_pl);
    }
    window.render = new RenderPipelineEditor('pipeline_diagram_canvas', 'canvas_container');
    resize_canvas();

    render.update_meansures();
    render.update_pipeline_diagram();
    render_onchoosedelement(null)

    document.getElementById("prop_name").addEventListener('keyup', input_onchangename);
    document.getElementById("prop_description").addEventListener('keyup', input_onchangename);
    render.onchoosedelement = render_onchoosedelement;
});


window.addEventListener("resize", resize_canvas);
