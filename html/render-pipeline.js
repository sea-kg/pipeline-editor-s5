
function JWwfsRY_random_makeid() {
    var length = 7;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

class RenderPipelineConfig {
    constructor() {
        this.pl_max_cell_x = -1;
        this.pl_max_cell_y = -1;
        this.pl_padding = 20;

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
        this.incoming = _json['incoming']
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
        return (idx - diff)*5;
    }


    draw_card(_ctx, selectedBlockIdEditing, highlightCard) {
        var paralax = this.get_paralax_in_cell();
        var x1 = this._conf.pl_padding + this.get_cell_x() * this._conf.get_cell_width() + paralax;
        var y1 = this._conf.pl_padding + this.get_cell_y() * this._conf.get_cell_height() + paralax;
        this.hidden_x1 = x1;
        this.hidden_y1 = y1;

        // fill
        if (selectedBlockIdEditing == this.nodeid) {
            _ctx.fillStyle = "red";
        } else {
            _ctx.fillStyle = highlightCard == this.nodeid ? "#E6ECDF" : this.cWIV4UF_color;
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
        this.pl_highlightCard = null;
        this.pl_data = {}; // original user data
        this.pt_data_render = {}; // TODO: data with preprocessing like a real x,y
        this.movingEnable = false;
        this.scrollMoving = false;
        this.scrollMovingPos = {};
        this.conneсtingBlocks = {
            'state': 'nope',
        };
        this.selectedBlock = {
            'block-id-undermouse': null
        };
        this.selectedBlockIdEditing = null;

        this.editorState = 'moving';

        // this.editorState = 'moving' or 'connecting-blocks' or 'removing-blocks'


        this.canvas = document.getElementById(canvas_id);
        this.canvas_container = document.getElementById(canvas_container_id);

        this.ctx = this.canvas.getContext("2d");
        this.init_canvas()

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

    init_canvas() {
        this.ctx.font = this.fontSize + "px Arial";
    }

    clone_object(obj) {
        var _json = JSON.stringify(obj);
        return JSON.parse(_json);
    }

    set_data(data) {
        this.pl_data = this.clone_object(data);
        this.prepare_data_render()
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
            console.log(nodeid)
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

        if (this.pl_highlightCard != null) {
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

        if (this.movingEnable && this.pl_highlightCard != null) {
            var t_x = Math.floor((x0 - this.pl_padding) / this._conf.get_cell_width());
            var t_y = Math.floor((y0 - this.pl_padding) / this._conf.get_cell_height());

            // console.log(y0);
            if (this.pl_data_render[this.pl_highlightCard].update_cell_xy(t_x, t_y)) {
                this.pl_data[this.pl_highlightCard].cell_x = t_x;
                this.pl_data[this.pl_highlightCard].cell_y = t_y;
                this.prepare_data_cards_one_cells()
                this.update_pipeline_diagram();
            }
            return;
        }
        
        var changesExists = false;
        this.pl_highlightCard = null;
        // var block_id = find_block_id(x0, y0);

        for (var i in this.pl_data) {
            var x1 = this.pl_data_render[i].hidden_x1;
            var x2 = x1 + this._conf.get_card_width();
            var y1 = this.pl_data_render[i].hidden_y1;
            var y2 = y1 + this._conf.get_card_height();
            var res = false;

            if (x0 > x1 && x0 < x2 && y0 > y1 && y0 < y2) {
                res = true;
                target.style.cursor = 'pointer';
                this.pl_highlightCard = i;
            }

            if (this.pl_data[i]['hidden_highlight'] != res) {
                changesExists = true;
                this.pl_data[i]['hidden_highlight'] = res;
            }
        }
        if (this.pl_highlightCard == null) {
            target.style.cursor = 'default';
        }
        if (changesExists) {
            this.update_pipeline_diagram();
        }
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

    draw_line(x0, y0, x1, y1, x2, y2) {
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 2;
        // out circle
        this.ctx.beginPath();
        this.ctx.arc(x0, y0, 6, 0, Math.PI);
        this.ctx.fill();

        // arrow
        this.ctx.beginPath();
        this.ctx.moveTo(x2 - 6, y2 - 12);
        this.ctx.lineTo(x2 + 6, y2 - 12);
        this.ctx.lineTo(x2 + 0, y2 - 0);
        this.ctx.lineTo(x2 - 6, y2 - 12);
        this.ctx.fill();

        if (x0 == x1 && x1 == x2) {
            this.ctx.beginPath();
            this.ctx.moveTo(x0, y0);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        } else {
            var cw = 10;
            this.ctx.beginPath();
            this.ctx.moveTo(x0, y0);
            this.ctx.lineTo(x0, y1 - cw);
            this.ctx.stroke();

            var _x0 = x0;
            var _x1 = x1;
            var _x2 = x2;
            if (x2 < x0) {
                _x0 = x0 - cw;
                _x1 = x1 - cw;
                _x2 = x2 + cw;
                this.ctx.beginPath();
                this.ctx.arc(x0 - cw, y1 - cw, cw, 0, Math.PI / 2);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(_x2, y1 + cw, cw, Math.PI, - Math.PI / 2);
                this.ctx.stroke();
            } else {
                _x0 = x0 + cw;
                _x1 = x1 - cw;
                _x2 = x2 - cw;

                this.ctx.beginPath();
                this.ctx.arc(_x0, y1 - cw, cw, Math.PI / 2, Math.PI);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(_x2, y1 + cw, cw, 1.5 * Math.PI, 2 * Math.PI);
                this.ctx.stroke();
            }

            // horizontal first
            this.ctx.beginPath();
            this.ctx.moveTo(_x0, y1);
            this.ctx.lineTo(_x0, y1);
            this.ctx.stroke();
            
            // vertical
            this.ctx.beginPath();
            this.ctx.moveTo(_x0, y1);
            this.ctx.lineTo(_x2, y1);
            this.ctx.stroke();

            // horizontal last
            this.ctx.beginPath();
            this.ctx.moveTo(x2, y1 + cw);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    }

    draw_lines() {
        this.ctx.lineWidth = 1;
        for (var nodeid in this.pl_data_render) {
            var p = this.pl_data_render[nodeid];

            if (p.incoming) {

                var main_x1 = this.calcX_in_px(p.get_cell_x()) + this._conf.get_card_width() / 2;
                var main_y1 = this.calcY_in_px(p.get_cell_y());

                var max_y = 0;
                var min_x = 0;
                var max_x = 0;
                var has_income = false;
                for (var inc in p.incoming) {
                    var node = this.pl_data[inc];
                    if (!node) {
                        continue;
                    }
                    var inc_x1 = this.calcX_in_px(node.cell_x) + this._conf.get_card_width() / 2;
                    var inc_y1 = this.calcY_in_px(node.cell_y) + this._conf.get_card_height();

                    if (!has_income) {
                        has_income = true;
                        max_y = inc_y1;
                        min_x = inc_x1;
                        max_x = inc_x1;
                    } else {
                        max_y = Math.max(inc_y1, max_y);
                        min_x = Math.min(inc_x1, min_x);
                        max_x = Math.max(inc_x1, max_x);
                    }
                }

                min_x = Math.min(main_x1, min_x);
                max_x = Math.max(main_x1, max_x);

                max_y += this._conf.get_cell_height() / 2 + (this._conf.get_cell_height() - this._conf.get_card_height()) / 2;

                for (var inc in p.incoming) {
                    var in_node = this.pl_data_render[inc];
                    if (!in_node) {
                        continue;
                    }
                    var paralax = in_node.get_paralax_for_line(nodeid);
                    if (paralax != 0) {
                        // console.log("in_nodeid=", inc, "out_nodeid=", nodeid, ", paralax=", paralax);
                        // console.log(in_node)
                    }
                    
                    // TODO calculate in node
                    var inc_x1 = this.calcX_in_px(in_node.get_cell_x()) + this._conf.get_card_width() / 2 + paralax;
                    var inc_y1 = this.calcY_in_px(in_node.get_cell_y()) + this._conf.get_card_height();

                    this.draw_line(
                        inc_x1, inc_y1,
                        inc_x1, max_y - paralax,
                        main_x1, main_y1
                    )
                }
                
                // if (has_income) {
                //     // horizontal line
                //     
                // }
            }
        }
    }

    update_pipeline_diagram() {
        this.update_image_size();
        this.init_canvas();
        this.clear_canvas();
        this.draw_grid();
        this.draw_cards();
        this.draw_lines();
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
            console.log(this.pl_data[bl2])
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
        for(var node_id in this.pl_data) {
            var node = new RenderPipelineNode(node_id, this._conf)
            node.copy_from_json(this.pl_data[node_id])
            this.pl_data_render[node_id] = node
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
