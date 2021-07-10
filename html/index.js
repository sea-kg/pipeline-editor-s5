

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
    var _data = JSON.parse(json_content.value);
    render.set_data(_data);
    render.update_meansures();
    render.update_pipeline_diagram();
}

function switch_to_tab_json() {
    var _data = render.get_data();
    json_content.value = JSON.stringify(_data, undefined, 4);
}

function switch_to_tab_export() {
    var _data = render.get_data();
    json_content.value = JSON.stringify(_data, undefined, 4);
}

function switch_to_tab_settings() {
    var _data = render.get_data();
    json_content.value = JSON.stringify(_data, undefined, 4);

}

function switch_to_tab_about() {
    var _data = render.get_data();
    json_content.value = JSON.stringify(_data, undefined, 4);
}


function save_as_image() {
    const dataUrl = pipeline_diagram_canvas.toDataURL("png");
    var win = window.open();
    win.document.write('<iframe src="' + dataUrl  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen> </iframe>');
}

function save_to_localstorage() {
    var _data = render.get_data();
    _data = JSON.stringify(_data, undefined, 4);
    localStorage.setItem('_data', _data);
}

function clear_localstorage() {
    localStorage.setItem('_data', '{}');
    render.set_data({})
    render.update_meansures();
    render.update_pipeline_diagram();
}

function sample_localstorage() {
    localStorage.removeItem('_data');
    render.set_data(data_pl_example);
    render.update_meansures();
    render.update_pipeline_diagram();
}

function connect_blocks() {
    render.start_connect_blocks();
}


function resize_canvas() {
    console.log(window.innerWidth);

    var canvas_cont = document.getElementById('canvas_container');

    var left_panel = 60;
    var right_panel = 150;
    var paddings = 120;

    var new_width = (window.innerWidth - left_panel - right_panel - paddings) + 'px';
    canvas_cont.style['max-width'] = new_width;
    canvas_cont.style['width'] = new_width;
    

    var new_height = (window.innerHeight - 150) + 'px';
    canvas_cont.style['max-height'] = new_height;
    canvas_cont.style['height'] = new_height;
}

function input_onchangename() {
    var block_id = document.getElementById("prop_block_id").value;
    if (block_id) {
        render.pl_data_render[block_id].set_name(document.getElementById("prop_name").value);
        render.pl_data_render[block_id].set_description(document.getElementById("prop_description").value);
        render.pl_data_render[block_id].set_color(document.getElementById("prop_color").value);
        // render.prepare_data_render();
        render.update_meansures();
        render.update_pipeline_diagram();
    }
}

function render_onchoosedelement(block_id) {
    if (block_id) {
        document.getElementById("prop_block_id").value = block_id;
        document.getElementById("prop_name").value = render.pl_data_render[block_id].get_name();
        document.getElementById("prop_name").removeAttribute('readonly');
        document.getElementById("prop_description").value = render.pl_data_render[block_id].get_description();
        document.getElementById("prop_description").removeAttribute('readonly');
        document.getElementById("prop_color").value = render.pl_data_render[block_id].get_color();
        document.getElementById("prop_color").removeAttribute('readonly');
    } else {
        document.getElementById("prop_block_id").value = "";
        document.getElementById("prop_name").value = "";
        document.getElementById("prop_name").setAttribute('readonly', true);
        document.getElementById("prop_description").value = "";
        document.getElementById("prop_description").setAttribute('readonly', true);
        document.getElementById("prop_color").value = "";
        document.getElementById("prop_color").setAttribute('readonly', true);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    var _data = localStorage.getItem('_data')
    if (_data) {
        _data = JSON.parse(_data);
    } else {
        _data = data_pl_example;
    }
    window.render = new RenderPipelineEditor('pipeline_diagram_canvas', {
        "mode-viewer": false,
    });
    render.set_data(_data);

    resize_canvas();
    render.update_meansures();
    render.update_pipeline_diagram();
    render_onchoosedelement(null)

    document.getElementById("prop_name").addEventListener('keyup', input_onchangename);
    document.getElementById("prop_description").addEventListener('keyup', input_onchangename);
    document.getElementById("prop_color").addEventListener('keyup', input_onchangename);
    
    render.onchoosedelement = render_onchoosedelement;
});


window.addEventListener("resize", resize_canvas);
