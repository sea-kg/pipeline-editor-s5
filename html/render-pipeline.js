
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

    has_intersection(line) {
        if (this.orientation == line.orientation) {
            return this.has_collision(line);
        } else if (this.orientation == RPL_LINE_ORIENT_HORIZONTAL) {
            return (line.x0 > this.xmin && line.x0 < this.xmax)
                && (this.y0 > line.ymin && this.y0 < line.ymax)
            ;
        } else if (this.orientation == RPL_LINE_ORIENT_VERTICAL) {
            return (line.y0 > this.ymin && line.y0 < this.ymax)
                && (this.x0 > line.xmin && this.x0 < line.xmax)
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

    has_perpendicular_intersections(line) {
        // return false;
        return line.has_intersection(this.line1)
            || line.has_intersection(this.line2)
            || line.has_intersection(this.line3)
        ;
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
        // this.IQrRW7r_cell_x = 0;
        // this.IQrRW7r_cell_y = 0;
        this.update_cell_xy(0,0)
        this.need_update_meansure = true;
        this.dtbqA0E_nodes_in_same_cells = []
        this.dtbqA0E_paralax_precalculated = 0
        this.dfIxewv_outcoming = []
        this.cWIV4UF_color = "#ffffff";
    }

    to_json() {
        return {
            "name": this.name,
            "description": this.description,
            "incoming": this.incoming,
            "cell_x": this.IQrRW7r_cell_x,
            "cell_y": this.IQrRW7r_cell_y,
            "color": this.cWIV4UF_color
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
        this.cWIV4UF_color = val;
    }

    get_color() {
        return this.cWIV4UF_color;
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


    draw_card(_ctx, selectedBlockIdEditing) {
        var paralax = this.get_paralax_in_cell();
        var x1 = this._conf.pl_padding + this.get_cell_x() * this._conf.get_cell_width() + paralax;
        var y1 = this._conf.pl_padding + this.get_cell_y() * this._conf.get_cell_height() + paralax;
        this.hidden_x1 = x1;
        this.hidden_y1 = y1;

        // fill
        if (selectedBlockIdEditing == this.nodeid) {
            _ctx.fillStyle = "red";
        } else {
            _ctx.fillStyle = this.cWIV4UF_color;
        }
        _ctx.fillRect(x1, y1, this._conf.get_card_width(), this._conf.get_card_height());
        _ctx.fillStyle = "black";

        _ctx.strokeRect(x1, y1, this._conf.get_card_width(), this._conf.get_card_height());
        var d = 20;
        var x1_name = (this._conf.get_card_width() - this.name_width) / 2;
        _ctx.fillText('' + this.get_name(), x1 + x1_name, y1 + d);
        d += 20;
        var x1_description = (this._conf.get_card_width() - this.description_width) / 2;
        _ctx.fillText('' + this.get_description(), x1 + x1_description, y1 + d);
    }
}

class RenderPipelineEditor {
    constructor(canvas_id, canvas_container_id) {
        this.fontSize = 16;
        this._conf = new RenderPipelineConfig()
        this.pl_height = 100;
        this.is_draw_grid = true;
        this.pl_width = 100;
        this.pl_padding = 20;
        this.pl_scale = 1.0;
        this.pl_data = {}; // original user data
        this.pt_data_render = {}; // TODO: data with preprocessing like a real x,y
        this.movingEnable = false;
        this.scrollMoving = false;
        this.scrollMovingPos = {};
        this.diagram_name = "";
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
        this.editorState = 'moving';
        
        // this.editorState = 'moving' or 'connecting-blocks' or 'removing-blocks'

        this.canvas = document.getElementById(canvas_id);
        this.canvas_container = document.getElementById(canvas_container_id);

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
        this.pl_data = this.clone_object(data);
        this.prepare_data_render();
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

        if (this.editorState == 'remove') {
            var nodeid = this.selectedBlock['block-id-undermouse'];
            console.log(nodeid);
            if (nodeid) {
                this.selectedBlockIdEditing = null;
                delete this.pl_data[nodeid];
                delete this.pt_data_render[nodeid];
                this.prepare_data_render();
                this.update_meansures();
                this.update_pipeline_diagram();
                this.editorState = 'moving';
                
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
        for (var i in this.pl_data) {
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
                this.pl_data[this.selectedBlockIdEditing].cell_x = t_x;
                this.pl_data[this.selectedBlockIdEditing].cell_y = t_y;
                this.prepare_data_cards_one_cells();
                this.update_pipeline_diagram();
            }
            return;
        }

        // var block_id = this.find_block_id(x0, y0);

        var cursor = 'default';
        for (var i in this.pl_data) {
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
        for (var node_id in this.pl_data) {
            var _node_orig = this.pl_data[node_id]
            var _node_r = this.pl_data_render[node_id]
            _node_r.set_name(_node_orig.name)
            _node_r.set_description(_node_orig.description)
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
        for (var i in this.pl_data) {
            this.pl_data[i]['hidden_highlight'] = false; // reset here ?
            new_max_cell_x = Math.max(this.pl_data[i].cell_x, new_max_cell_x);
            new_max_cell_y = Math.max(this.pl_data[i].cell_y, new_max_cell_y);
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
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.pl_width, this.pl_height);
        this.ctx.strokeRect(0, 0, this.pl_width, this.pl_height);
        
    }

    draw_grid() {
        if (!this.is_draw_grid) {
            return;
        }
        
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "#E9F0E0";
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

    draw_connections() {
        this.drawed_lines_cache.clear();
        this.connections = [];
        this.ctx.lineWidth = 1;
        for (var in_nodeid in this.pl_data_render) {
            var p = this.pl_data_render[in_nodeid];
            if (p.incoming) {

                var x2 = this.calcX_in_px(p.get_cell_x()) + this._conf.get_card_width() / 2;
                var y2 = this.calcY_in_px(p.get_cell_y());

                var y1 = [];
                for (var inc in p.incoming) {
                    y1.push(this.pl_data_render[inc].get_cell_y());
                }
                y1 = Math.max.apply(null, y1);
                y1 = this.calcY_in_px(y1) + this._conf.get_card_height();
                y1 += this._conf.get_cell_height() / 2 + (this._conf.get_cell_height() - this._conf.get_card_height()) / 2;

                var in_count = 0;
                for (var out_nodeid in p.incoming) {
                    in_count++;
                }
                var iter = 0;
                for (var out_nodeid in p.incoming) {
                    var in_node = this.pl_data_render[out_nodeid];
                    var paralax = in_node.get_paralax_for_line(in_nodeid);
                    
                    // TODO calculate in node
                    var x0 = this.calcX_in_px(in_node.get_cell_x()) + this._conf.get_card_width() / 2 + paralax;
                    var y0 = this.calcY_in_px(in_node.get_cell_y()) + this._conf.get_card_height();
                    var idx = 0;
                    if (in_count > 1) {
                        idx = iter - parseInt(in_count/2);
                    }
                    this.add_to_draw_connection(
                        Math.floor(x0),
                        Math.floor(x2 + idx*15),
                        Math.floor(y0),
                        Math.floor(y1),
                        Math.floor(y2),
                        out_nodeid,
                        in_nodeid,
                    );
                    iter++;
                }
            }
        }
        
        // try swap lines for minimal crosses
        this.beautify_connections();

        for (var i in this.connections) {
            this.connections[i].draw(this.ctx);
        }
    }

    find_perpendicular_intersections(i0) {
        var conn = this.connections[i0]
        var ret = [];
        for (var i in this.connections) {
            if (i0 == i) {
                continue; // skip same node
            }
            var _conn = this.connections[i];
            if (
                   _conn.line1.has_intersection(conn.line1)
                || _conn.line2.has_intersection(conn.line1)
                || _conn.line3.has_intersection(conn.line1)
                || _conn.line1.has_intersection(conn.line2)
                || _conn.line2.has_intersection(conn.line2)
                || _conn.line3.has_intersection(conn.line2)
                || _conn.line1.has_intersection(conn.line3)
                || _conn.line2.has_intersection(conn.line3)
                || _conn.line3.has_intersection(conn.line3)
            ) {
                ret.push(i);
            }
        }
        return ret;
    }

    find_in_connections(in_nodeid) {
        var ret = [];
        for (var i in this.connections) {
            if (this.connections[i].in_nodeid == in_nodeid) {
                ret.push(i);
            }
        }
        return ret;
    }

    swap_in_connections(i0, i1) {
        var l1_y1 = this.connections[i0].line1.y1;
        var l2_x1 = this.connections[i0].line2.x1;
        var l2_y0 = this.connections[i0].line2.y0;
        var l2_y1 = this.connections[i0].line2.y1;
        var l3_x0 = this.connections[i0].line3.x0;
        var l3_x1 = this.connections[i0].line3.x1;
        var l3_y0 = this.connections[i0].line3.y0;

        this.connections[i0].line1.set_y1(this.connections[i1].line1.y1);
        this.connections[i0].line2.set_x1(this.connections[i1].line2.x1);
        this.connections[i0].line2.set_y0(this.connections[i1].line2.y0);
        this.connections[i0].line2.set_y1(this.connections[i1].line2.y1);
        this.connections[i0].line3.set_x0(this.connections[i1].line3.x0);
        this.connections[i0].line3.set_x1(this.connections[i1].line3.x1);
        this.connections[i0].line3.set_y0(this.connections[i1].line3.y0);

        this.connections[i1].line1.set_y1(l1_y1);
        this.connections[i1].line2.set_x1(l2_x1);
        this.connections[i1].line2.set_y0(l2_y0);
        this.connections[i1].line2.set_y1(l2_y1);
        this.connections[i1].line3.set_x0(l3_x0);
        this.connections[i1].line3.set_x1(l3_x1);
        this.connections[i1].line3.set_y0(l3_y0);
    }

    print_connection_info(obj) {
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

    try_swaps(found_same_in, i0, found_length) {
        // console.log("try swaps for ", i0);
        for (var _i1 in found_same_in) {
            var i1 = found_same_in[_i1];
            // console.log("try swap with ", i1);
            if (i0 == i1) {
                // console.log("swap skip for same ", i1);
                continue; 
            }
            // console.log("swap " + i0 + " <> " + i1);
            this.swap_in_connections(i0, i1);
            var found2 = this.find_perpendicular_intersections(i0);
            // console.log("found2 ", found2);
            if (found2.length < found_length) {
                // console.log("found better solution ");
                return true;
            }
            // console.log("reverted swap");
            this.swap_in_connections(i1, i0);
        }
        return false;
    }

    beautify_connections() {
        var swaps = 1;
        var _while_protected = 0;
        while (swaps > 0) {
            _while_protected++;
            if (_while_protected > 500) {
                console.error(_while_protected);
                return;
            }
            swaps = 0;

            // debug
            /*console.log(this.connections);
            var in_nodeid = "tVIp2Oe";
            var i0 = 1;
            var i1 = 2;
            var found = this.find_perpendicular_intersections(i0);
            console.log("Found before");
            this.print_connection_info(found);

            var found_same_in = this.find_in_connections(in_nodeid);
            console.log("Found same in ", found_same_in);
            this.print_connection_info(found_same_in);
            console.log("swap " + i0 + " !!!!!")
            this.swap_in_connections(i1, i0);
            var found2 = this.find_perpendicular_intersections(i0);
            console.log("Found after");
            this.print_connection_info(found2);
            console.log(this.connections[i0])
            console.log(this.connections[i1])
            return;*/

            for (var i0 in this.connections) {
                var in_nodeid = this.connections[i0].in_nodeid;
                var out_nodeid = this.connections[i0].out_nodeid;
                // console.log("Process ", i0);
                // this.print_connection_info(i0);
                // 1. find count of intersections
                var found = this.find_perpendicular_intersections(i0);
                if (found.length > 0) {
                    // console.log("Found intersections", found);
                    // this.print_connection_info(found);
                    var found_same_in = this.find_in_connections(in_nodeid);
                    // console.log("Found same in ", found_same_in);
                    if (found_same_in.length > 0) {
                        if (this.try_swaps(found_same_in, i0, found.length)) {
                            swaps++;
                            // found = this.find_perpendicular_intersections(i0);
                        }
                    }
                }
            }
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
            this.pl_data[bl2]["incoming"][bl1] = "";
            // console.log(this.pl_data[bl2]);
            this.prepare_data_render();
            this.update_meansures();
            this.update_pipeline_diagram();
        }
    }

    export_to_json() {
        var _ret = {};
        for (var i in this.pl_data) {
            _ret[i] = {}
            for (var n in this.pl_data[i]) {
                if (n.startsWith("hidden_")) {
                    _ret[i][n] = undefined;        
                } else {
                    _ret[i][n] = this.pl_data[i][n];
                }
            }
        }
        return _ret;
    }

    add_block() {
        var pos_x = this.canvas_container.scrollLeft - this.pl_padding + this._conf.get_cell_width();
        pos_x = parseInt(pos_x / this._conf.get_cell_width());

        var pos_y = this.canvas_container.scrollTop - this.pl_padding + this._conf.get_cell_height()
        pos_y = parseInt(pos_y / this._conf.get_cell_height());

        var new_id = null;
        while (new_id == null) {
            new_id = JWwfsRY_random_makeid();
            if (this.pl_data[new_id]) {
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
            this.pl_data[new_id] = _node_d
            var node = new RenderPipelineNode(new_id, this._conf)
            node.copy_from_json(_node_d)
            this.pl_data_render[new_id] = node
            this.prepare_data_cards_one_cells()
        }

        this.selectedBlockIdEditing = new_id;
        this.update_meansures();
        this.update_pipeline_diagram();
        if (this.onchoosedelement) {
            this.onchoosedelement(new_id);
        }
    }

    remove_block() {
        this.editorState = 'remove';
    }

    prepare_data_render() {
        this.pl_data_render = {}
        for (var node_id in this.pl_data) {
            var node = new RenderPipelineNode(node_id, this._conf)
            node.copy_from_json(this.pl_data[node_id])
            this.pl_data_render[node_id] = node
        }

        for (var node_id in this.pl_data_render) {
            var node = this.pl_data_render[node_id];
            for (var nid in node.incoming) {
                if (!this.pl_data_render[nid]) {
                    console.warn("Removed incoming node ", nid, " for ", node_id)
                }
            }
        }

        this.prepare_data_cards_one_cells()
        this.prepare_lines_out();
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
