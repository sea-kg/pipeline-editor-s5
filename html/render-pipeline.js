
function JWwfsRY_random_makeid() {
    var length = 7;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
};

RPL_LINE_ORIENT_NONE = 0;
RPL_LINE_ORIENT_VERTICAL = 1;
RPL_LINE_ORIENT_HORIZONTAL = 2;
RPL_LINE_ORIENT_POINT = 3;

RPL_LINE_ANGEL_END_LEFT = 0;
RPL_LINE_ANGEL_END_RIGHT = 1;
RPL_LINE_ANGEL_RIGHT_DOWN = 2;
RPL_LINE_ANGEL_LEFT_DOWN = 3;

class RenderPipelineLine {
    constructor(x0, y0, x1, y1) {
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
        this.ymin = Math.min(this.y0, this.y1);
        this.ymax = Math.max(this.y0, this.y1);
        this.xmin = Math.min(this.x0, this.x1);
        this.xmax = Math.max(this.x0, this.x1);
        this.orientation = RPL_LINE_ORIENT_NONE;
        this.error = null;
        if (x0 == x1 && y0 != y1) {
            this.orientation = RPL_LINE_ORIENT_VERTICAL;
        } else if (y0 == y1 && x0 != x1) {
            this.orientation = RPL_LINE_ORIENT_HORIZONTAL;
        } else if (y0 == y1 && x0 == x1) {
            this.orientation = RPL_LINE_ORIENT_POINT;
        }
        if (this.orientation == '') {
            this.error = "Expected horizontal or vertical line";
            console.error(this.error, this);
        }
    }
    
    set_x0(val) {
        this.x0 = val;
        this.xmin = Math.min(this.x0, this.x1);
        this.xmax = Math.max(this.x0, this.x1);
    }

    set_x1(val) {
        this.x1 = val;
        this.xmin = Math.min(this.x0, this.x1);
        this.xmax = Math.max(this.x0, this.x1);
    }

    set_y0(val) {
        this.y0 = val;
        this.ymin = Math.min(this.y0, this.y1);
        this.ymax = Math.max(this.y0, this.y1);
    }

    set_y1(val) {
        this.y1 = val;
        this.ymin = Math.min(this.y0, this.y1);
        this.ymax = Math.max(this.y0, this.y1);
    }

    has_collision(line) {
        if (this.orientation != line.orientation) {
            return false;
        }
        if (this.orientation == RPL_LINE_ORIENT_VERTICAL) {
            return (line.x0 == this.x0)
                && (
                    (line.y0 > this.ymin && line.y0 < this.ymax)
                    || (line.y1 > this.ymin && line.y1 < this.ymax)
                )
            ;
        }
        if (this.orientation == RPL_LINE_ORIENT_HORIZONTAL) {
            return (line.y0 == this.y0)
                && (
                    (line.x0 > this.xmin && line.x0 < this.xmax)
                    || (line.x1 > this.xmin && line.x1 < this.xmax)
                )
            ;
        }
        return false;
    }

    draw_out_circle(_ctx, radius) {
        _ctx.beginPath();
        _ctx.arc(this.x0, this.y0, radius, 0, Math.PI);
        _ctx.fill();
    }

    draw_line(_ctx) {
        _ctx.beginPath();
        _ctx.moveTo(this.x0, this.y0);
        _ctx.lineTo(this.x1, this.y1);
        _ctx.stroke();
    }

    draw_arrow(_ctx, radius) {
        _ctx.beginPath();
        _ctx.moveTo(this.x1 - radius, this.y1 - radius*2);
        _ctx.lineTo(this.x1 + radius, this.y1 - radius*2);
        _ctx.lineTo(this.x1 +      0, this.y1 -        0);
        _ctx.lineTo(this.x1 - radius, this.y1 - radius*2);
        _ctx.fill();
    }

    draw_arc(_ctx, radius, angle) {
        var angle_start = 0;
        var angle_end = 0;
        var kx = 1;
        var ky = 1;
        if (angle == RPL_LINE_ANGEL_END_LEFT) {
            angle_start = 0;
            angle_end = Math.PI / 2;
            kx = -1;
            ky = -1;
        } else if (angle == RPL_LINE_ANGEL_END_RIGHT) {
            angle_start = Math.PI / 2;
            angle_end = Math.PI;
            kx = 1;
            ky = -1;
        } else if (angle == RPL_LINE_ANGEL_LEFT_DOWN) {
            angle_start = Math.PI;
            angle_end = - Math.PI / 2;
            kx = 1;
            ky = 1;
        } else if (angle == RPL_LINE_ANGEL_RIGHT_DOWN) {
            angle_start = 1.5 * Math.PI;
            angle_end = 2 * Math.PI;
            kx = -1;
            ky = 1;
        } else {
            console.error("Unknown type of angle");
        }   
        
        _ctx.beginPath();
        _ctx.arc(
            this.x1 + kx * radius,
            this.y1 + ky * radius,
            radius,
            angle_start,
            angle_end
        );
        _ctx.stroke();
    }
};

class RenderPipelineConnection {
    constructor(line1, line2, line3, conf, out_nodeid, in_nodeid) {
        this.line1 = line1;
        this.line2 = line2;
        this.line3 = line3;
        this._conf = conf;
        this.out_nodeid = out_nodeid;
        this.in_nodeid = in_nodeid;
    }

    draw(_ctx) {
        this.line1.draw_out_circle(_ctx, 6);
        this.line3.draw_arrow(_ctx, 6);
        
        if (this.line1.x0 == this.line3.x0) {
            // simple line 
            _ctx.beginPath();
            _ctx.moveTo(this.line1.x0, this.line1.y0);
            _ctx.lineTo(this.line1.x0, this.line3.y1);
            _ctx.stroke();
            return;
        }

        // horizontal first
        _ctx.beginPath();
        _ctx.moveTo(this.line1.x0, this.line1.y0);
        _ctx.lineTo(this.line1.x0, this.line1.y1 - this._conf.get_radius_for_angels());
        _ctx.stroke();

        var _x0, _x2;
        if (this.line3.x0 < this.line1.x0) {
            _x0 = this.line1.x0 - this._conf.get_radius_for_angels();
            _x2 = this.line3.x0 + this._conf.get_radius_for_angels();
            this.line1.draw_arc(
                _ctx,
                this._conf.get_radius_for_angels(),
                RPL_LINE_ANGEL_END_LEFT
            );
            
            this.line2.draw_arc(
                _ctx,
                this._conf.get_radius_for_angels(),
                RPL_LINE_ANGEL_LEFT_DOWN
            );
        } else {
            _x0 = this.line1.x0 + this._conf.get_radius_for_angels();
            _x2 = this.line3.x0 - this._conf.get_radius_for_angels();

            this.line1.draw_arc(
                _ctx,
                this._conf.get_radius_for_angels(),
                RPL_LINE_ANGEL_END_RIGHT
            );

            this.line2.draw_arc(
                _ctx,
                this._conf.get_radius_for_angels(),
                RPL_LINE_ANGEL_RIGHT_DOWN
            );
        }
        
        // vertical
        _ctx.beginPath();
        _ctx.moveTo(_x0, this.line2.y0);
        _ctx.lineTo(_x2, this.line2.y0);
        _ctx.stroke();

        // horizontal last
        _ctx.beginPath();
        _ctx.moveTo(this.line3.x0, this.line3.y0 + this._conf.get_radius_for_angels());
        _ctx.lineTo(this.line3.x1, this.line3.y1);
        _ctx.stroke();
    }
};

class RenderPipelineDrawedLinesCache {
    constructor() {
        this.clear();
    }

    add(line) {
        if (line.orientation == RPL_LINE_ORIENT_VERTICAL) {
            if (this.vertical_lines[line.x0] === undefined) {
                this.vertical_lines[line.x0] = [];
            }
            this.vertical_lines[line.x0].push(line);
        } else if (line.orientation == RPL_LINE_ORIENT_HORIZONTAL) {
            if (this.horizontal_lines[line.y0] === undefined) {
                this.horizontal_lines[line.y0] = [];
            }
            this.horizontal_lines[line.y0].push(line);
        }
    }

    has_collision(line) {
        if (line.orientation = RPL_LINE_ORIENT_HORIZONTAL) {
            if (this.horizontal_lines[line.y0]) {
                for (var l in this.horizontal_lines[line.y0]) {
                    var _line = this.horizontal_lines[line.y0][l];
                    if (_line.has_collision(line) || line.has_collision(_line)) {
                        return true;
                    }
                }
            }

        } else if (line.orientation = RPL_LINE_ORIENT_VERTICAL) {
            if (this.vertical_lines[line.x0]) {
                for (var l in this.vertical_lines[line.x0]) {
                    var _line = this.horizontal_lines[line.x0][l];
                    if (_line.has_collision(line) || line.has_collision(_line)) {
                        return true;
                    }
                }
            }
        } else {
            console.error("Some shit");
        }
        return false;
    }

    clear() {
        this.vertical_lines = {};
        this.horizontal_lines = {};
    }
};

class RenderPipelineConfig {
    constructor() {
        this.pl_max_cell_x = -1;
        this.pl_max_cell_y = -1;
        this.pl_padding = 20;
        this.wZFF096_radius_for_angels = 10;
        this.GVitVNl_pl_cell_width = 170;
        this.GVitVNl_pl_cell_height = 86;
        this.CEisN2z_pl_card_width = 159;
        this.CEisN2z_pl_card_height = 62;
    }

    set_max_cell_xy(x,y) {
        if (this.pl_max_cell_x != x || this.pl_max_cell_y != y) {
            this.pl_max_cell_x = x;
            this.pl_max_cell_y = y;
            return true;
        }
        return false;
    }

    set_cell_size(width, height) {
        this.GVitVNl_pl_cell_width = width;
        this.GVitVNl_pl_cell_height = height;
    }

    get_cell_width() {
        return this.GVitVNl_pl_cell_width;
    }

    get_cell_height() {
        return this.GVitVNl_pl_cell_height;
    }

    get_padding() {
        return this.pl_padding;
    }

    set_card_size(width, height) {
        this.CEisN2z_pl_card_width = width;
        this.CEisN2z_pl_card_height = height;
        this.GVitVNl_pl_cell_width = this.CEisN2z_pl_card_width + 20;
        this.GVitVNl_pl_cell_height = this.CEisN2z_pl_card_height + 20;
    }

    get_card_width() {
        return this.CEisN2z_pl_card_width;
    }

    get_card_height() {
        return this.CEisN2z_pl_card_height;
    }

    get_radius_for_angels() {
        return this.wZFF096_radius_for_angels;
    }
}

class RenderPipelineNode {
    constructor(nodeid, _conf) {
        this._conf = _conf;
        this.nodeid = nodeid;
        this.name = "edit me";
        this.name_width = 0;
        this.description = "edit me";
        this.description_width = 0;
        this.max_card_width = 0;
        this.incoming = {};
        this.incoming_order = [];
        // this.IQrRW7r_cell_x = 0;
        // this.IQrRW7r_cell_y = 0;
        this.update_cell_xy(0,0)
        this.need_update_meansure = true;
        this.dtbqA0E_nodes_in_same_cells = []
        this.dtbqA0E_paralax_precalculated = 0
        this.dfIxewv_outcoming = []
        this.cWIV4UF_fillColor = "#ffffff";
    }

    to_json() {
        return {
            "name": this.name,
            "description": this.description,
            "incoming": this.incoming,
            "cell_x": this.IQrRW7r_cell_x,
            "cell_y": this.IQrRW7r_cell_y,
            "color": this.cWIV4UF_fillColor
        }
    }

    copy_from_json(_json) {
        this.set_name(_json['name'])
        this.set_description(_json['description'])
        if (_json['color']) {
            this.set_color(_json['color'])
        }
        this.incoming = {};
        for (var nid in _json['incoming']) {
            this.incoming[nid] = _json['incoming'][nid];
        }
        this.update_cell_xy(_json["cell_x"], _json["cell_y"])
    }

    update_cell_xy(pos_x, pos_y) {
        if (
            this.IQrRW7r_cell_x != pos_x
            || this.IQrRW7r_cell_y != pos_y
        ) {
            this.IQrRW7r_cell_x = pos_x;
            this.IQrRW7r_cell_y = pos_y;
            this.IQrRW7r_hash_cell_xy = "x" + pos_x + "-y" + pos_y;
            return true;
        }
        return false;
    }

    get_hash_cell_xy() {
        return this.IQrRW7r_hash_cell_xy;
    }

    get_cell_x() {
        return this.IQrRW7r_cell_x;
    }

    get_cell_y() {
        return this.IQrRW7r_cell_y;
    }

    set_color(val) {
        this.cWIV4UF_fillColor = val;
    }

    get_color() {
        return this.cWIV4UF_fillColor;
    }

    set_name(name) {
        if (this.name != name) {
            this.name = name
            this.need_update_meansure = true;
        }
    }

    get_name() {
        return this.name; 
    }

    set_description(description) {
        if (this.description != description) {
            this.description = description
            this.need_update_meansure = true;
        }
    }

    get_description() {
        return this.description;
    }

    update_meansures(_ctx) {
        if (this.need_update_meansure) {
            this.max_card_width = 0
            var tMeas = _ctx.measureText(this.name);
            this.max_card_width = Math.max(tMeas.width, this.max_card_width);
            this.name_width = parseInt(tMeas.width);
            tMeas = _ctx.measureText(this.description);
            this.max_card_width = Math.max(tMeas.width, this.max_card_width);
            this.description_width = parseInt(tMeas.width);
        }
        return this.max_card_width;
    }

    nodes_in_same_cells_reset() {
        this.dtbqA0E_nodes_in_same_cells = []
        this.dtbqA0E_paralax_precalculated = 0;
    }

    nodes_in_same_cells_add(node_id) {
        this.dtbqA0E_nodes_in_same_cells.push(node_id)
        // paralax
        var diff = parseInt(this.dtbqA0E_nodes_in_same_cells.length / 2);
        var idx = this.dtbqA0E_nodes_in_same_cells.indexOf(this.nodeid);
        this.dtbqA0E_paralax_precalculated = (idx - diff)*3;
    }

    get_paralax_in_cell() {
        return this.dtbqA0E_paralax_precalculated;
    }

    outcoming_reset() {
        this.dfIxewv_outcoming = []
    }

    outcoming_add(nodeid) {
        this.dfIxewv_outcoming.push(nodeid)
    }

    get_paralax_for_line(node_id) {
        if (this.dfIxewv_outcoming.length == 1) {
            return 0;
        }
        // paralax
        var diff = parseInt(this.dfIxewv_outcoming.length / 2);
        var idx = this.dfIxewv_outcoming.indexOf(node_id);
        return (idx - diff)*15;
    }

    update_incoming_sort(pl_data_render) {
        this.incoming_order = []
        for(var nodeid in this.incoming) {
            this.incoming_order.push(nodeid);
        }
        this.incoming_order.sort(function(a, b) {
            return pl_data_render[a].get_cell_x() - pl_data_render[b].get_cell_x();
        })
    }

    draw_card(_ctx, selectedBlockIdEditing) {
        var paralax = this.get_paralax_in_cell();
        var x1 = this._conf.pl_padding + this.get_cell_x() * this._conf.get_cell_width() + paralax;
        var y1 = this._conf.pl_padding + this.get_cell_y() * this._conf.get_cell_height() + paralax;
        this.hidden_x1 = x1;
        this.hidden_y1 = y1;

        // fill
        _ctx.fillStyle = this.cWIV4UF_fillColor;
        _ctx.fillRect(x1, y1, this._conf.get_card_width(), this._conf.get_card_height());
        _ctx.fillStyle = "black";

        // stroke
        if (selectedBlockIdEditing == this.nodeid) {
            _ctx.strokeStyle = "red";
            _ctx.lineWidth = 5;
        } else {
            _ctx.strokeStyle = "black";
            _ctx.lineWidth = 1;
        }
        _ctx.strokeRect(x1, y1, this._conf.get_card_width(), this._conf.get_card_height());

        var d = 20;
        var x1_name = (this._conf.get_card_width() - this.name_width) / 2;
        _ctx.fillText('' + this.get_name(), x1 + x1_name, y1 + d);
        d += 20;
        var x1_description = (this._conf.get_card_width() - this.description_width) / 2;
        _ctx.fillText('' + this.get_description(), x1 + x1_description, y1 + d);
    }
}

PIPELINE_EDITOR_STATE_MOVING = 0;
PIPELINE_EDITOR_STATE_REMOVING_BLOCKS = 1;
PIPELINE_EDITOR_STATE_ADDING_BLOCKS = 2;
PIPELINE_EDITOR_STATE_ADDING_CONNECTIONS = 3;

class RenderPipelineEditor {
    constructor(canvas_id, cfg) {
        this.fontSize = 16;
        this.diagram_name = "Edit me";
        this.backgroundColor = "#F6F7F1";
        
        this._conf = new RenderPipelineConfig()
        this.pl_height = 100;
        this.is_draw_grid = true;
        this.grid_color = "#bacaa6";
        this.pl_width = 100;
        this.pl_padding = 20;
        this.pl_scale = 1.0;
        this.pl_data_render = {};
        this.movingEnable = false;
        this.scrollMoving = false;
        this.scrollMovingPos = {};
        this.perf = [];
        this.diagram_description = "";
        this.conneсtingBlocks = {
            'state': 'nope',
        };
        this.selectedBlock = {
            'block-id-undermouse': null
        };
        this.selectedBlockIdEditing = null;
        this.drawed_lines_cache = new RenderPipelineDrawedLinesCache();
        this.connections = [];
        this.editor_state = PIPELINE_EDITOR_STATE_MOVING;
        this.mode_viewer = false;
        
        if (cfg) {
            if (cfg['mode-viewer'] === true) {
                this.mode_viewer = true;
            }
        }
        // this.editor_state = 'moving' or 'connecting-blocks' or 'removing-blocks'

        this.canvas = document.getElementById(canvas_id);
        this.canvas_container = this.canvas.parentElement;

        this.ctx = this.canvas.getContext("2d");
        this.init_font_size();

        var self = this;
        this.canvas.onmouseover = function(event) {
            self.canvas_onmouseover(event);
        }
        this.canvas.onmouseout = function(event) {
            self.canvas_onmouseout(event);
        }
        this.canvas.onmouseup = function(event) {
            self.canvas_onmouseup(event);
        }
        this.canvas.onmousedown = function(event) {
            self.canvas_onmousedown(event);
        }
        this.canvas.onmousemove = function(event) {
            self.canvas_onmousemove(event);
        }
    }

    init_font_size() {
        this.ctx.font = this.fontSize + "px Arial";
    }

    clone_object(obj) {
        var _json = JSON.stringify(obj);
        return JSON.parse(_json);
    }

    set_data(data) {
        this.diagram_name = data["title"];
        this.diagram_description = data["description"];
        if (data["background-color"]) {
            this.backgroundColor = data["background-color"];
        }
        
        this.pl_data_render = {};
        for (var node_id in data["nodes"]) {
            var node = new RenderPipelineNode(node_id, this._conf)
            node.copy_from_json(data["nodes"][node_id])
            this.pl_data_render[node_id] = node;
        }

        for (var node_id in this.pl_data_render) {
            var node = this.pl_data_render[node_id];
            for (var nid in node.incoming) {
                if (!this.pl_data_render[nid]) {
                    console.warn("Removed incoming node ", nid, " for ", node_id)
                }
            }
        }

        this.prepare_data_cards_one_cells();
        this.prepare_lines_out();

        this.update_meansures();
        this.update_pipeline_diagram();
    }

    get_data() {
        var _ret = {};
        _ret["title"] = this.diagram_name;
        _ret["description"] = this.diagram_description;
        _ret["background-color"] = this.backgroundColor;
        _ret["nodes"] = {};
        for (var i in this.pl_data_render) {
            _ret["nodes"][i] = this.pl_data_render[i].to_json();
        }
        return _ret;
    }

    extract_all_keys_from_obj(obj, keys) {
        for (var k in obj) {
            if (keys[k]) {
                keys[k]++;
            } else {
                keys[k] = 1;
            }
            var val = obj[k];
            if (typeof val == "object") {
                keys = this.extract_all_keys_from_obj(val, keys);
            } else {
                if (keys[val]) {
                    keys[val]++;
                } else {
                    keys[val] = 1;
                }
            }
        }
        return keys;
    }

    replace_all_keys_in_obj(obj, replace_keys) {
        for (var k in obj) {
            if (replace_keys[k]) {
                var new_k = replace_keys[k];
                obj[new_k] = obj[k];
                delete obj[k];
                k = new_k;
            }

            var val = obj[k];
            if (typeof val == "object") {
                obj[k] = this.replace_all_keys_in_obj(val, replace_keys);
            } else {
                if (replace_keys[val]) {
                    obj[k] = replace_keys[val];
                }
            }
        }
        return obj;
    }

    get_data_share() {
        if (window.LZString === undefined) {
            console.error("LZString not found. try include from here https://github.com/pieroxy/lz-string/tree/master/libs");
            return;
        }
        var _data = this.get_data();
        _data = JSON.stringify(_data);
        return encodeURIComponent(LZString.compressToBase64(_data));
    }

    set_data_share(data) {
        if (window.LZString === undefined) {
            console.error("LZString not found. try include from here https://github.com/pieroxy/lz-string/tree/master/libs");
            return;
        }
        var _data = LZString.decompressFromBase64(decodeURIComponent(data));
        _data = JSON.parse(_data);
        this.set_data(_data);
    }

    change_state_to_removing_blocks() {
        this.editor_state = PIPELINE_EDITOR_STATE_REMOVING_BLOCKS;
    }

    canvas_onmouseover(event) {
        // var target = event.target;
        this.movingEnable = false;
        this.scrollMoving = false;
        this.update_pipeline_diagram();
    };

    canvas_onmouseout(event) {
        // var target = event.target;
        this.movingEnable = false;
        this.scrollMoving = false;
        this.update_pipeline_diagram()
    };
    
    canvas_onmouseup(event) {
        // var target = event.target;
        if (event.button == 1) { // scroll button
            this.scrollMoving = false;
            return;
        }
        if (this.movingEnable) {
            this.movingEnable = false;
        }
    }

    canvas_onmousedown(event) {
        // var target = event.target;
        if (event.button == 1) { // scroll button
            this.scrollMoving = true;
            this.scrollMovingPos = {
                left: this.canvas_container.scrollLeft,
                top: this.canvas_container.scrollTop,
                x: event.clientX,
                y: event.clientY,
            };
            return;
        }

        if (this.editor_state == PIPELINE_EDITOR_STATE_REMOVING_BLOCKS) {
            var nodeid = this.selectedBlock['block-id-undermouse'];
            console.log(nodeid);
            if (nodeid) {
                this.selectedBlockIdEditing = null;
                delete this.pl_data_render[nodeid];
                // this.prepare_data_render();
                this.update_meansures();
                this.update_pipeline_diagram();
                this.editor_state = PIPELINE_EDITOR_STATE_REMOVING_BLOCKS; // continue removing blocks
                
                // reset selection
                this.selectedBlockIdEditing = null;
                if (this.onchoosedelement) {
                    this.onchoosedelement(null);
                }
            }
            return;
        }

        if (this.onchoosedelement) {
            this.onchoosedelement(this.selectedBlock['block-id-undermouse']);
        }
        if (this.selectedBlockIdEditing != this.selectedBlock['block-id-undermouse']) {
            this.selectedBlockIdEditing = this.selectedBlock['block-id-undermouse'];
            this.update_pipeline_diagram();
        }

        if (this.conneсtingBlocks.state == 'select-incoming') {
            console.log(this.conneсtingBlocks);
            if (this.conneсtingBlocks.incoming_block_id != null) {
                this.conneсtingBlocks.state = 'select-block';
            }
        } else if (this.conneсtingBlocks.state == 'select-block') {
            console.log(this.conneсtingBlocks);
            if (this.conneсtingBlocks.block_id != null) {
                this.conneсtingBlocks.state = 'finish';
                this.do_connection_blocks();
            }
        }

        if (this.selectedBlockIdEditing != null) {
            // console.log(target);
            this.movingEnable = true;
        }
    };

    find_block_id(x0, y0) {
        var found_val = null;
        for (var i in this.pl_data_render) {
            var x1 = this.pl_data_render[i].hidden_x1;
            var x2 = x1 + this._conf.get_card_width();
            var y1 = this.pl_data_render[i].hidden_y1;
            var y2 = y1 + this._conf.get_card_height();
            if (x0 > x1 && x0 < x2 && y0 > y1 && y0 < y2) {
                found_val = i;
            }
        }
        return found_val;
    }

    canvas_onmousemove(event) {
        var target = event.target;
        // console.log(event);
        var co = target.getBoundingClientRect();
        // console.log(co);
        var x0 = event.clientX - co.left;
        var y0 = event.clientY - co.top;
        var block_id = this.find_block_id(x0, y0);

        this.selectedBlock['block-id-undermouse'] = block_id;

        if (this.conneсtingBlocks.state == 'select-incoming') {
            this.conneсtingBlocks.incoming_block_id = block_id;
            // console.log(this.conneсtingBlocks)
        }

        if (this.conneсtingBlocks.state == 'select-block') {
            this.conneсtingBlocks.block_id = block_id;
            // console.log(this.conneсtingBlocks)
        }

        if (this.scrollMoving) {
            const dx = event.clientX - this.scrollMovingPos.x;
            const dy = event.clientY - this.scrollMovingPos.y;

            // Scroll the element
            this.canvas_container.scrollTop = this.scrollMovingPos.top - dy;
            this.canvas_container.scrollLeft = this.scrollMovingPos.left - dx;
            return;
        }

        if (this.movingEnable && this.selectedBlockIdEditing != null) {
            var t_x = Math.floor((x0 - this.pl_padding) / this._conf.get_cell_width());
            var t_y = Math.floor((y0 - this.pl_padding) / this._conf.get_cell_height());
            
            if (t_x < 0 || t_y < 0) {
                // don't allow move to the left and top border
                return;
            }
            // console.log(y0);
            if (this.pl_data_render[this.selectedBlockIdEditing].update_cell_xy(t_x, t_y)) {
                this.prepare_data_cards_one_cells();
                this.update_pipeline_diagram();
            }
            return;
        }

        // var block_id = this.find_block_id(x0, y0);

        var cursor = 'default';
        for (var i in this.pl_data_render) {
            var x1 = this.pl_data_render[i].hidden_x1;
            var x2 = x1 + this._conf.get_card_width();
            var y1 = this.pl_data_render[i].hidden_y1;
            var y2 = y1 + this._conf.get_card_height();

            if (x0 > x1 && x0 < x2 && y0 > y1 && y0 < y2) {
                cursor = 'pointer';
            }
        }
        target.style.cursor = cursor;
    };

    scale_plus(diff) {
        this.pl_scale += diff;
        var tr_x = parseInt((this.pl_width * this.pl_scale - this.pl_width)/2);
        var tr_y = parseInt((this.pl_height * this.pl_scale - this.pl_height)/2);
        this.canvas.style.transform = "scale(" + this.pl_scale + ") translate(" + tr_x + "px, " + tr_y + "px)"
    }

    scale_reset() {
        this.pl_scale = 1.0
        this.canvas.style.transform = "scale(" + this.pl_scale + ")";
    }
    
    scale_minus(diff) {
        this.pl_scale -= diff;
        var tr_x = parseInt((this.pl_width * this.pl_scale - this.pl_width)/2);
        var tr_y = parseInt((this.pl_height * this.pl_scale - this.pl_height)/2);
        this.canvas.style.transform = "scale(" + this.pl_scale + ") translate(" + tr_x + "px, " + tr_y + "px)";
    }

    update_meansures() {
        var max_width = 0;
        for (var node_id in this.pl_data_render) {
            var _node_r = this.pl_data_render[node_id]
            var card_width = _node_r.update_meansures(this.ctx)
            max_width = Math.max(card_width, max_width)
        }
        this._conf.set_card_size(
            parseInt(max_width) + 20,
            this._conf.get_card_height()
        );
    }

    update_image_size() {
        var new_max_cell_x = 0;
        var new_max_cell_y = 0;
        for (var i in this.pl_data_render) {
            this.pl_data_render[i].hidden_highlight = false; // reset here ?
            new_max_cell_x = Math.max(this.pl_data_render[i].get_cell_x(), new_max_cell_x);
            new_max_cell_y = Math.max(this.pl_data_render[i].get_cell_y(), new_max_cell_y);
        }

        if (this._conf.set_max_cell_xy(new_max_cell_x, new_max_cell_y)) {
            this.pl_width =  (this._conf.pl_max_cell_x + 1) * this._conf.get_cell_width() + 2 * this.pl_padding + 100;
            this.pl_height = (this._conf.pl_max_cell_y + 1) * this._conf.get_cell_height() + 2 * this.pl_padding + 100;
            this.canvas.width  = this.pl_width;
            this.canvas.height = this.pl_height;
            this.canvas.style.width  = this.pl_width + 'px';
            this.canvas.style.height = this.pl_height + 'px';
        }
    }

    calcX_in_px(cell_x) {
        return this.pl_padding + cell_x * this._conf.get_cell_width();
    }
    
    calcY_in_px(cell_y) {
        return this.pl_padding + cell_y * this._conf.get_cell_height();
    }

    clear_canvas() {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.pl_width, this.pl_height);
        this.ctx.strokeRect(0, 0, this.pl_width, this.pl_height);
        this.ctx.fillStyle = '#FFFFFF';
    }

    draw_grid() {
        if (!this.is_draw_grid) {
            return;
        }
        
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = this.grid_color;
        for (var x = this.pl_padding; x <= this.pl_width; x = x + this._conf.get_cell_width()) {
            var x1 = x - (this._conf.get_cell_width() - this._conf.get_card_width()) / 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, 0);
            this.ctx.lineTo(x1, this.pl_height);
            this.ctx.stroke();
        }
    
        for (var y = this.pl_padding; y <= this.pl_height; y = y + this._conf.get_cell_height()) {
            var y1 = y - (this._conf.get_cell_height() - this._conf.get_card_height()) / 2;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y1);
            this.ctx.lineTo(this.pl_width, y1);
            this.ctx.stroke();
        }
    }
    
    draw_diagram_name() {
        var font_name_size = 32;
        var font_description_size = 20;

        // this.diagram_name = "Test";
        // this.diagram_description = "test descr";

        this.ctx.font = font_name_size + "px Arial";
        this.ctx.fillText('' + this.diagram_name, this.pl_padding, this.pl_padding + font_name_size);

        this.ctx.font = font_description_size + "px Arial";
        this.ctx.fillText('' + this.diagram_description, this.pl_padding + 10, this.pl_padding + font_name_size + font_description_size);

        this.init_font_size();
    }

    draw_cards() {
        this.ctx.strokeStyle = "black";
        this.ctx.fillStyle = "black";
        // ctx.fillRect(10, 10, 100, 100);
        this.ctx.lineWidth = 1;

        for (var nodeid in this.pl_data_render) {
            var _node = this.pl_data_render[nodeid]
            _node.draw_card(this.ctx, this.selectedBlockIdEditing, this.pl_highlightCard);
            _node.update_incoming_sort(this.pl_data_render);
        }
    }

    correct_line(line) {
        var has_collision = true;
        var protection_while = 0;
        var step_size = 5;
        while (has_collision) {
            has_collision = false;
            protection_while++;
            if (this.drawed_lines_cache.has_collision(line)) {
                has_collision = true;
                if (line.orientation = RPL_LINE_ORIENT_HORIZONTAL) {
                    line.set_y0(line.y0 - step_size);
                    line.set_y1(line.y1 - step_size);
                } else if (line.orientation = RPL_LINE_ORIENT_VERTICAL) {
                    line.set_x0(line.x0 + step_size);
                    line.set_x1(line.x1 + step_size);
                } else {
                    console.error("Some shit");
                    return line;
                }
            }
            if (protection_while > 100) {
                console.error("protection_while, Some shit");
                return line;
            }
        }
        return line;
    }

    check_error(line, out_nodeid, in_nodeid) {
        if (line.error) {
            console.error("Error (" + out_nodeid + "->" + in_nodeid + "): " + line.error);
        }
    }

    add_to_draw_connection(x0, x2, y0, y1, y2, out_nodeid, in_nodeid) {
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 2;

        var line1 = new RenderPipelineLine(x0, y0, x0, y1);
        this.check_error(line1, out_nodeid, in_nodeid);

        var line2 = new RenderPipelineLine(x0, line1.y1, x2, line1.y1);
        this.check_error(line2, out_nodeid, in_nodeid);
        line2 = this.correct_line(line2);
        line1.y1 = line2.y0;

        var line3 = new RenderPipelineLine(x2, line2.y1, x2, y2);
        this.check_error(line3, out_nodeid, in_nodeid);
        
        this.drawed_lines_cache.add(line1);
        this.drawed_lines_cache.add(line2);
        this.drawed_lines_cache.add(line3);

        this.connections.push(new RenderPipelineConnection(
            line1,
            line2,
            line3,
            this._conf,
            out_nodeid,
            in_nodeid
        ));
    }
    
    auto_placement() {
        // console.log("Auto placement - start")
        // reset all nodes to 0,0
        for (var in_nodeid in this.pl_data_render) {
            this.pl_data_render[in_nodeid].update_cell_xy(0, 0);
        }

        // redesign by y
        var ty = 1;
        var safe_while = 0; 
        while (ty > 0)  {
            ty = 0;
            safe_while++;
            if (safe_while > 1000) {
                console.warn("Auto placement - while safe (y)")
                break;
            }
            for (var cur_nodeid in this.pl_data_render) {
                var _p0 = this.pl_data_render[cur_nodeid];
                var _p0x = _p0.get_cell_x();
                var _p0y = _p0.get_cell_y();
                var all_incomes = [];
                for (var in_nodeid in _p0.incoming) {
                    var _p1 = this.pl_data_render[in_nodeid];
                    all_incomes.push(_p1.get_cell_y());
                }
                if (all_incomes.length > 0) {
                    var max_y = Math.max.apply(null, all_incomes);
                    max_y = max_y + 2;
                    if (_p0y != max_y) {
                        _p0.update_cell_xy(_p0x, max_y);
                        ty++;
                    }
                }
            }
        }

        // redesign by x
        var tx = 1;
        var safe_while_x = 0; 
        while (tx > 0)  {
            tx = 0;
            safe_while_x++;
            if (safe_while_x > 1000) {
                console.warn("Auto placement - while safe (x)")
                break;
            }
            for (var cur_nodeid in this.pl_data_render) {
                var _p0 = this.pl_data_render[cur_nodeid];
                var _p0x = _p0.get_cell_x();
                var _p0y = _p0.get_cell_y();
                var all_incomes = [];
                for (var other_nodeid in this.pl_data_render) {
                    if (other_nodeid != cur_nodeid) {
                        var _p1 = this.pl_data_render[other_nodeid];
                        if (
                            _p1.get_cell_x() == _p0x
                            && _p1.get_cell_y() == _p0y
                        ) {
                            _p1.update_cell_xy(_p0x+1, _p0y);
                            tx++;
                        }
                    }
                }
            }
        }

        // console.log("Auto placement - done");

        this.prepare_data_cards_one_cells();
        this.prepare_lines_out();

        this.update_meansures();
        this.update_pipeline_diagram();
    }

    draw_connections() {
        this.drawed_lines_cache.clear();
        this.connections = [];
        this.ctx.lineWidth = 1;
        var middle_of_height = this._conf.get_cell_height() / 2 + (this._conf.get_cell_height() - this._conf.get_card_height()) / 2;
        for (var in_nodeid in this.pl_data_render) {
            var p = this.pl_data_render[in_nodeid];
            var in_count = p.incoming_order.length;
            if (p.incoming) {

                var x2 = this.calcX_in_px(p.get_cell_x()) + this._conf.get_card_width() / 2;
                var y2 = this.calcY_in_px(p.get_cell_y());

                var y1 = [];
                for (var inc in p.incoming) {
                    var in_node = this.pl_data_render[inc];
                    if (in_node) {
                        y1.push(in_node.get_cell_y());
                    }
                }
                y1 = Math.max.apply(null, y1);
                y1 = this.calcY_in_px(y1) + this._conf.get_cell_height();
                y1 += middle_of_height;

                var iter = 0;
                for (var out_nodeid in p.incoming) {
                    var in_node = this.pl_data_render[out_nodeid];
                    if (!in_node) {
                        console.error("Not found node with id " + inc);
                        continue;
                    }
                    var paralax = in_node.get_paralax_for_line(in_nodeid);
                    
                    // TODO calculate in node
                    var x0 = this.calcX_in_px(in_node.get_cell_x()) + this._conf.get_card_width() / 2 + paralax;
                    var y0 = this.calcY_in_px(in_node.get_cell_y()) + this._conf.get_card_height();
                    var idx = p.incoming_order.indexOf(out_nodeid);
                    // console.log("in_count: ", (in_count - 1) / 2);
                    var in_x2_diff = idx * 15 - ((in_count - 1) / 2) * 15;
                    var in_y1_diff = (in_count - idx)*10 - ((in_count - 1) / 2)*10;
                    this.add_to_draw_connection(
                        Math.floor(x0),
                        Math.floor(x2 + in_x2_diff),
                        Math.floor(y0),
                        Math.floor(y1 - in_y1_diff),
                        Math.floor(y2),
                        out_nodeid,
                        in_nodeid,
                    );
                    iter++;
                }
            }
        }

        for (var i in this.connections) {
            this.connections[i].draw(this.ctx);
        }
    }

    debug_print_connection_info(obj) {
        if (!Array.isArray(obj)) {
            obj = [obj];
        }
        for (var i in obj) {
            var i0 = obj[i];
            var in_nodeid = this.connections[i0].in_nodeid;
            var out_nodeid = this.connections[i0].out_nodeid;
            var in_node = this.pl_data_render[in_nodeid];
            var out_node = this.pl_data_render[out_nodeid];
            console.log(i0 + ": " + out_node.name + " -> " + in_node.name);
        }
    }

    update_pipeline_diagram() {
        var start = performance.now();
        this.update_image_size();
        this.init_font_size();
        this.clear_canvas();
        this.draw_grid();
        this.draw_cards();
        this.draw_connections();
        this.draw_diagram_name();
        var _perf = performance.now() - start;
        this.perf.push(_perf);
        console.log("perf = ", _perf, "ms, length " + this.perf.length);
    }

    start_connect_blocks() {
        this.conneсtingBlocks.state = 'select-incoming';
    }

    do_connection_blocks() {
        console.log(this.conneсtingBlocks);
        if (this.conneсtingBlocks.state == 'finish') {
            this.conneсtingBlocks.state = 'nope';
            var bl1 = this.conneсtingBlocks.incoming_block_id;
            var bl2 = this.conneсtingBlocks.block_id;
            this.pl_data_render[bl2].incoming[bl1] = "";
            // this.prepare_data_render();
            this.update_meansures();
            this.update_pipeline_diagram();
        }
    }

    

    add_block() {
        var pos_x = this.canvas_container.scrollLeft - this.pl_padding + this._conf.get_cell_width();
        pos_x = parseInt(pos_x / this._conf.get_cell_width());

        var pos_y = this.canvas_container.scrollTop - this.pl_padding + this._conf.get_cell_height()
        pos_y = parseInt(pos_y / this._conf.get_cell_height());

        var new_id = null;
        while (new_id == null) {
            new_id = JWwfsRY_random_makeid();
            if (this.pl_data_render[new_id]) {
                new_id = null;
                continue;
            }
            const _node_d = {
                "name": "edit me",
                "description": "edit me",
                "incoming": {},
                "cell_x": pos_x,
                "cell_y": pos_y
            }
            var _new_node = new RenderPipelineNode(new_id, this._conf);
            _new_node.copy_from_json(_node_d);
            this.pl_data_render[new_id] = _new_node;
            this.prepare_data_cards_one_cells();
        }

        this.selectedBlockIdEditing = new_id;
        this.update_meansures();
        this.update_pipeline_diagram();
        if (this.onchoosedelement) {
            this.onchoosedelement(new_id);
        }
    }

    prepare_data_cards_one_cells() {
        // reset
        var coord_list = {}
        for (var nodeid in this.pl_data_render) {
            var _node = this.pl_data_render[nodeid]
            _node.nodes_in_same_cells_reset();
            var _hcxy = _node.get_hash_cell_xy();
            if (!coord_list[_hcxy]) {
                coord_list[_hcxy] = []
            }
            coord_list[_hcxy].push(nodeid)
        }
        for (var nodeid in this.pl_data_render) {
            var _node = this.pl_data_render[nodeid]
            var _hcxy = _node.get_hash_cell_xy();
            for (var nid in coord_list[_hcxy]) {
                _node.nodes_in_same_cells_add(coord_list[_hcxy][nid]);
            }
        }
    }
    
    prepare_lines_out() {
        for (var nodeid in this.pl_data_render) {
            var _node = this.pl_data_render[nodeid]
            _node.outcoming_reset()
        }

        for (var nodeid in this.pl_data_render) {
            var _node = this.pl_data_render[nodeid]
            for (var nid in _node.incoming) {
                if (this.pl_data_render[nid]) {
                    this.pl_data_render[nid].outcoming_add(nodeid)
                } else {
                    console.warn("Node with id=" + nid + " does not exists")
                }
            }
        }
    }
};
