
window.autosave_enabled = false;

function parsePageParams() {
    var loc = location.search.slice(1);
    var arr = loc.split("&");
    var result = {};
    var regex = new RegExp("(.*)=([^&#]*)");
    for(var i = 0; i < arr.length; i++){
        if(arr[i].trim() != ""){
            var p = regex.exec(arr[i].trim());
            // console.log("results: " + JSON.stringify(p));
            if(p == null)
                result[decodeURIComponent(arr[i].trim().replace(/\+/g, " "))] = '';
            else
                result[decodeURIComponent(p[1].replace(/\+/g, " "))] = decodeURIComponent(p[2].replace(/\+/g, " "));
        }
    }
    console.log(JSON.stringify(result));
    return result;
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

function ui_render_switch_draw_grid(el) {
    if (render.is_draw_grid) {
        render.is_draw_grid = false;
        el.classList.add('pressed')
    } else {
        render.is_draw_grid = true;
        el.classList.remove('pressed')
    }
    render.update_pipeline_diagram();
}

function ui_render_update_states() {
    const states_elements = {
        "pipeline-editor-functions-btn moving-block": PIPELINE_EDITOR_S5_STATE_MOVING_BLOCKS,
        "pipeline-editor-functions-btn remove-block": PIPELINE_EDITOR_S5_STATE_REMOVING_BLOCKS,
        "pipeline-editor-functions-btn add-block": PIPELINE_EDITOR_S5_STATE_ADDING_BLOCKS,
        "pipeline-editor-functions-btn connect-blocks": PIPELINE_EDITOR_S5_STATE_ADDING_CONNECTIONS,
    };
    for (var n in states_elements) {
        var el = document.getElementsByClassName(n)[0];
        if (render.get_editor_state() == states_elements[n]) {
            el.classList.add('pressed');
        } else {
            el.classList.remove('pressed');
        }
    }
}

function ui_render_removing_blocks(el) {
    if (render.get_editor_state() != PIPELINE_EDITOR_S5_STATE_REMOVING_BLOCKS) {
        render.change_state_to_removing_blocks();
    } else {
        render.change_state_to_moving_blocks();
    }
    ui_render_update_states();
}

function ui_render_moving_blocks(el) {
    render.change_state_to_moving_blocks();
    ui_render_update_states();
}

function ui_render_add_blocks(el) {
    render.change_state_to_adding_blocks();
    ui_render_update_states();
}

function make_share_url(el) {
    var _url = location.protocol + "//" + location.host + location.pathname
    _url += "?v=" + render.get_data_share();
    window.open(_url, '_blank').focus();
    // var windowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
    // var windowObjectReference = window.open(_url, "CNN_WindowName", windowFeatures);
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

    document.getElementById("settings_background_color").value = render.backgroundColor;
    document.getElementById("settings_diagram_name").value = render.diagram_name;
    document.getElementById("settings_diagram_description").value = render.diagram_description;
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
    // console.log(window.innerWidth);

    var canvas_cont = document.getElementById('canvas_container');

    var left_panel = 60;
    var right_panel = 150;
    var paddings = 120;
    var height_padding = 150;
    if (render.mode_viewer) {
        right_panel = 0;
        left_panel = 0;
        paddings = 50;
        height_padding = 70;
    }

    var new_width = (window.innerWidth - left_panel - right_panel - paddings) + 'px';
    canvas_cont.style['max-width'] = new_width;
    canvas_cont.style['width'] = new_width;
    

    var new_height = (window.innerHeight - height_padding) + 'px';
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

function input_onchangediagramsettings(el) {
    var _data = JSON.parse(json_content.value);
    _data["title"] = document.getElementById("settings_diagram_name").value;
    _data["description"] = document.getElementById("settings_diagram_description").value;
    _data["background-color"] = document.getElementById("settings_background_color").value;
    json_content.value = JSON.stringify(_data, undefined, 4);
    render.set_data(_data);
    render.update_meansures();
    render.update_pipeline_diagram();
}

function render_onselectedblock(block_id) {
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

function render_onchanged() {
    if (window.autosave_enabled) {
        save_to_localstorage();
    }
}

document.addEventListener("DOMContentLoaded", function() {
    var _data = {}
    var _params = parsePageParams();
    if (_params["v"] !== undefined) {
        // view mode
        window.render = new RenderPipelineEditor('pipeline_diagram_canvas', {
            "mode-viewer": true,
        });
        render.set_data_share(_params["v"]);
        document.getElementById("container_functions").style.display = "none";
        document.getElementById("container_properties").style.display = "none";
        document.getElementById("container_editor_tabs").style.display = "none";
        document.getElementById("tab_content_ui_editor").style.top = "5px";
        document.getElementById("tab_content_ui_editor").style.height = "calc(100% - 55px)";
        render.is_draw_grid = false;
    } else {
        // editor mode
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
    }

    resize_canvas();
    render.update_meansures();
    render.update_pipeline_diagram();
    render_onselectedblock(null);


    document.getElementById("prop_name").addEventListener('keyup', input_onchangename);
    document.getElementById("prop_description").addEventListener('keyup', input_onchangename);
    document.getElementById("prop_color").addEventListener('keyup', input_onchangename);

    var el_settings = document.getElementsByClassName("diagram-settings-input");

    for(var i = 0; i < el_settings.length; i++) {
        el_settings[i].addEventListener('keyup', input_onchangediagramsettings);
    }
    document.getElementById("settings_autosave").value = localStorage.getItem("autosave") || "off";
    window.autosave_enabled = (document.getElementById("settings_autosave").value == "on");
    document.getElementById("settings_autosave").onchange = function(el) {
        var v = this.options[this.selectedIndex].value;
        window.autosave_enabled = (v == "on");
        localStorage.setItem("autosave", v);
    }

    render.onselectedblock = render_onselectedblock;
    render.onchanged = render_onchanged;
    ui_render_update_states();
});


window.addEventListener("resize", resize_canvas);
