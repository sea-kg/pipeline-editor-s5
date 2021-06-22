class RenderPipelineEditor {
    constructor(canvas_id, canvas_container_id) {
        this.fontSize = 16;
        this.pl_cell_width = 170;
        this.pl_cell_height = 86;
        this.pl_card_width = 159;
        this.pl_card_height = 62;
        this.pl_height = 100;
        this.is_draw_grid = true;
        this.pl_width = 100;
        this.pl_padding = 20;
        this.pl_scale = 1.0;
        this.pl_highlightCard = null;
        this.pl_data = {}; // TODO: original user data
        this.pt_data_tmp = {}; // TODO: data with preprocessing like a real x,y
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
        

        // this.editorState = 'moving' or 'connecting-blocks' or 'removing-blocks'


        this.canvas = document.getElementById(canvas_id);
        this.canvas_container = document.getElementById(canvas_container_id);

        this.ctx = this.canvas.getContext("2d");
        this.ctx.font = this.fontSize + "px Arial";

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

        if (this.onchoosedelement) {
            this.onchoosedelement(this.selectedBlock['block-id-undermouse'])
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
        for (var i in data_pl) {
            var x1 = data_pl[i].hidden_x1;
            var x2 = x1 + this.pl_card_width;
            var y1 = data_pl[i].hidden_y1;
            var y2 = y1 + this.pl_card_height;
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
            var t_x = Math.floor((x0 - this.pl_padding) / this.pl_cell_width);
            var t_y = Math.floor((y0 - this.pl_padding) / this.pl_cell_height);

            // console.log(y0);
            if (data_pl[this.pl_highlightCard].cell_x != t_x || data_pl[this.pl_highlightCard].cell_y != t_y) {
                data_pl[this.pl_highlightCard].cell_x = t_x;
                data_pl[this.pl_highlightCard].cell_y = t_y;
                this.update_pipeline_diagram();
            }
            return;
        }
        
        var changesExists = false;
        this.pl_highlightCard = null;
        // var block_id = find_block_id(x0, y0);

        for (var i in data_pl) {
            var x1 = data_pl[i].hidden_x1;
            var x2 = x1 + this.pl_card_width;
            var y1 = data_pl[i].hidden_y1;
            var y2 = y1 + this.pl_card_height;
            var res = false;

            if (x0 > x1 && x0 < x2 && y0 > y1 && y0 < y2) {
                res = true;
                target.style.cursor = 'pointer';
                this.pl_highlightCard = i;
            }

            if (data_pl[i]['hidden_highlight'] != res) {
                changesExists = true;
                data_pl[i]['hidden_highlight'] = res;
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
        // var pl_cell_max_x = 0;
        // var pl_cell_max_y = 0;
        for (var i in data_pl) {
            var tMeas = this.ctx.measureText(data_pl[i]['name']);
            max_width = Math.max(tMeas.width, max_width);
            data_pl[i]['hidden_name_width'] = parseInt(tMeas.width);
            tMeas = this.ctx.measureText(data_pl[i]['description']);
            max_width = Math.max(tMeas.width, max_width);
            data_pl[i]['hidden_description_width'] = parseInt(tMeas.width);
            // pl_cell_max_x = Math.max(data_pl['cell_x'])
            // pl_cell_max_y = Math.max(data_pl['cell_y'])
        }
        this.pl_card_width = parseInt(max_width) + 20;
        this.pl_cell_width = this.pl_card_width + 20;
        // this.pl_height = pl_cell_max_y * pl_cell_height;
        // this.pl_width = pl_cell_max_x * pl_cell_width;
    }

    update_image_size() {
        var max_cell_x = -1;
        var max_cell_y = -1;
        var new_max_cell_x = 0;
        var new_max_cell_y = 0;
        for (var i in data_pl) {
            data_pl[i]['hidden_highlight'] = false;
            new_max_cell_x = Math.max(data_pl[i].cell_x, new_max_cell_x);
            new_max_cell_y = Math.max(data_pl[i].cell_y, new_max_cell_y);
        }

        if (new_max_cell_x != max_cell_x || new_max_cell_y != max_cell_y) {
            max_cell_y = new_max_cell_y;
            max_cell_x = new_max_cell_x;

            this.pl_width = (max_cell_x + 1) * this.pl_cell_width + 2 * this.pl_padding + 100;
            this.pl_height = (max_cell_y + 1) * this.pl_cell_height + 2 * this.pl_padding + 100;
            this.canvas.width  = this.pl_width;
            this.canvas.height = this.pl_height;
            this.canvas.style.width  = this.pl_width + 'px';
            this.canvas.style.height = this.pl_height + 'px';
        }
        /*console.log("max_cell_x = ", max_cell_x);
        console.log("this.pl_width = ", this.pl_width);
        console.log("max_cell_y = ", max_cell_y);
        console.log("this.pl_height = ", this.pl_height);*/
    }

    calcX_in_px(cell_x) {
        return this.pl_padding + cell_x * this.pl_cell_width;
    }
    
    calcY_in_px(cell_y) {
        return this.pl_padding + cell_y * this.pl_cell_height;
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

        this.ctx.strokeStyle = "#E9F0E0";
        for (var x = this.pl_padding; x <= this.pl_width; x = x + this.pl_cell_width) {
            var x1 = x - (this.pl_cell_width - this.pl_card_width) / 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, 0);
            this.ctx.lineTo(x1, this.pl_height);
            this.ctx.stroke();
        }
    
        for (var y = this.pl_padding; y <= this.pl_height; y = y + this.pl_cell_height) {
            var y1 = y - (this.pl_cell_height - this.pl_card_height) / 2;
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

        // cards
        for (var i in data_pl) {
            var p = data_pl[i];
            // console.log(p);
            var x1 = this.pl_padding + p.cell_x * this.pl_cell_width;
            var y1 = this.pl_padding + p.cell_y * this.pl_cell_height;
            data_pl[i].hidden_x1 = x1;
            data_pl[i].hidden_y1 = y1;

            // fill
            if (this.selectedBlockIdEditing == i) {
                this.ctx.fillStyle = "red";
            } else {
                this.ctx.fillStyle = this.pl_highlightCard == i ? "#E6ECDF" : "white";
            }
            this.ctx.fillRect(x1, y1, this.pl_card_width, this.pl_card_height);
            this.ctx.fillStyle = "black";

            this.ctx.strokeRect(x1, y1, this.pl_card_width, this.pl_card_height);
            var d = 20;
            var x1_name = (this.pl_card_width - p['hidden_name_width']) / 2;
            this.ctx.fillText('' + p['name'], x1 + x1_name, y1 + d);
            d += 20;
            var x1_description = (this.pl_card_width - p['hidden_description_width']) / 2;
            this.ctx.fillText('' + p['description'], x1 + x1_description, y1 + d);
        }
    }

    draw_lines() {
        this.ctx.lineWidth = 1;
        for (var i in data_pl) {
            var p = data_pl[i];

            if (p.incoming) {

                var main_x1 = this.calcX_in_px(p.cell_x) + this.pl_card_width / 2;
                var main_y1 = this.calcY_in_px(p.cell_y);

                var max_y = 0;
                var min_x = 0;
                var max_x = 0;
                var has_income = false;
                for (var inc in p.incoming) {
                    var node = data_pl[inc];
                    if (!node) {
                        continue;
                    }
                    var inc_x1 = this.calcX_in_px(node.cell_x) + this.pl_card_width / 2;
                    var inc_y1 = this.calcY_in_px(node.cell_y) + this.pl_card_height;

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

                max_y += this.pl_cell_height / 2 + (this.pl_cell_height - this.pl_card_height) / 2;

                for (var inc in p.incoming) {
                    var node = data_pl[inc];
                    if (!node) {
                        continue;
                    }
                    var inc_x1 = this.calcX_in_px(node.cell_x) + this.pl_card_width / 2;
                    var inc_y1 = this.calcY_in_px(node.cell_y) + this.pl_card_height;

                    // out circle
                    this.ctx.beginPath();
                    this.ctx.arc(inc_x1, inc_y1, 6, 0, Math.PI);
                    this.ctx.fill();

                    this.ctx.beginPath();
                    this.ctx.moveTo(inc_x1, inc_y1);
                    this.ctx.lineTo(inc_x1, max_y);
                    this.ctx.stroke();

                    this.ctx.fillRect(inc_x1 - 3, max_y - 3, 6, 6);
                }
                
                if (has_income) {
                    // horizontal line
                    this.ctx.beginPath();
                    this.ctx.moveTo(min_x, max_y);
                    this.ctx.lineTo(max_x, max_y);
                    this.ctx.stroke();

                    // to
                    this.ctx.beginPath();
                    this.ctx.moveTo(main_x1, max_y);
                    this.ctx.lineTo(main_x1, main_y1);
                    this.ctx.stroke();

                    // arrow
                    this.ctx.beginPath();
                    this.ctx.moveTo(main_x1 - 6, main_y1 - 12);
                    this.ctx.lineTo(main_x1 + 6, main_y1 - 12);
                    this.ctx.lineTo(main_x1, main_y1);
                    this.ctx.lineTo(main_x1 - 6, main_y1 - 12);
                    this.ctx.fill();
                }
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
            data_pl[bl2]["incoming"][bl1] = "";
            console.log(data_pl[bl2])
            this.update_pipeline_diagram();
            
        }
    }
};
