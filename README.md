# pipeline-editor-s5

[![Total alerts](https://img.shields.io/lgtm/alerts/g/sea-kg/pipeline-editor-s5.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/sea-kg/pipeline-editor-s5/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/sea-kg/pipeline-editor-s5.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/sea-kg/pipeline-editor-s5/context:javascript) [![npm](https://img.shields.io/npm/v/pipeline-editor-s5)](https://www.npmjs.com/package/pipeline-editor-s5)

Pipeline Editor s5 (just ui-editor)

[example-editor](https://sea-kg.com/pipeline-editor-s5/)

![Alt text](/contrib/screenshot-01.jpg?raw=true "Screenshot 01")


## Integration

```html
<div style="overflow: scroll; height: 400px; min-height: 400px;">
    <canvas id="pipeline_diagram_canvas"></canvas>
</div>
<script src="./render-pipeline.js?ver=1"></script>
<script>
    window.render1 = new RenderPipelineEditor('pipeline_diagram_canvas', {
        // HERE configs
    });
    render1.set_data({
        "title": "Some",
        "nodes": {
            "aCaqNjY": {
                "name": "One",
                "description": "...",
                "incoming": {},
                "cell_x": 1,
                "cell_y": 0,
                "color": "#ffffff"
            },
            "kB3Cu9b": {
                "name": "Two",
                "description": "...",
                "incoming": {
                    "aCaqNjY": ""
                },
                "cell_x": 2,
                "cell_y": 2,
                "color": "#ffffff"
            }
        }
    });
</script>
```

## Integration to angular project

```
$ npm install --save pipeline-editor-s5
```

angular.json:
```
...
    "scripts": [
        ...,
        "node_modules/pipeline-editor-s5/html/render-pipeline.js"
    ]
...
```

add to html-template:
```
...
<div class="pipeline-viewer-container">
    <canvas id="pipeline_viewer"></canvas>
</div>
...
```

add to css:
```
.pipeline-viewer-container {
    display: none;
    overflow: scroll;
    max-height: 10px;
    height: 10px;
    min-height: 10px;
}
```

add to ts file:
```
...
declare var RenderPipelineEditor: any;
...

    show_data() : void {
        this.pipelineEditorInst = new RenderPipelineEditor(
          'pipeline_viewer'
        );
        this.pipelineEditorInst.set_data(this.pipelineData);
    }
```

## Documentation

### Events

* `onselectedblock(blockid)` - when user selected a block
* `onchanged()` - when changed something in scheme

### Enums

Pipeline editor state:

* `PIPELINE_EDITOR_STATE_MOVING = 0;`
* `PIPELINE_EDITOR_STATE_REMOVING_BLOCKS = 1;`
* `PIPELINE_EDITOR_STATE_ADDING_BLOCKS = 2;`
* `PIPELINE_EDITOR_STATE_ADDING_CONNECTIONS = 3;`

Line orientation:

* `RPL_LINE_ORIENT_NONE = 0;`
* `RPL_LINE_ORIENT_VERTICAL = 1;`
* `RPL_LINE_ORIENT_HORIZONTAL = 2;`
* `RPL_LINE_ORIENT_POINT = 3;`

Line angel:

* `RPL_LINE_ANGEL_END_LEFT = 0;`
* `RPL_LINE_ANGEL_END_RIGHT = 1;`
* `RPL_LINE_ANGEL_RIGHT_DOWN = 2;`
* `RPL_LINE_ANGEL_LEFT_DOWN = 3;`

### Class RenderPipelineEditor

Constructor, example:

`window.render = new RenderPipelineEditor(element_id_canvas);`

* `constructor(canvas_id, cfg)`
* `init_font_size()`
* `clone_object(obj)`
* `set_data(data)` - set new data-json, 
* `get_data()` - will return data-json
* `extract_all_keys_from_obj(obj, keys)`
* `replace_all_keys_in_obj(obj, replace_keys)`
* `get_data_share()`
* `set_data_share(data)`
* `change_state_to_removing_blocks()`
* `canvas_onmouseover(event)`
* `canvas_onmouseout(event)`
* `canvas_onmouseup(event)`
* `canvas_onmousedown(event)`
* `find_block_id(x0, y0)`
* `canvas_onmousemove(event)`
* `scale_plus(diff)`
* `scale_reset()`
* `scale_minus(diff)`
* `update_meansures()` - Update meansures (like a width of blocks)
* `update_image_size()`
* `calcX_in_px(cell_x)`
* `calcY_in_px(cell_y)`
* `clear_canvas()`
* `draw_grid()`
* `draw_diagram_name()`
* `draw_cards()`
* `call_onselectedblock` - private method for call function `onselectedblock` (only if defined by user)
* `correct_line(line)`
* `check_error(line, out_nodeid, in_nodeid)`
* `add_to_draw_connection(x0, x2, y0, y1, y2, out_nodeid, in_nodeid)`
* `auto_placement()`
* `draw_connections()`
* `debug_print_connection_info(obj)`
* `update_pipeline_diagram()`
* `start_connect_blocks()`
* `do_connection_blocks()`
* `add_block()`
* `prepare_data_cards_one_cells()`
* `prepare_lines_out()`


### Class `RenderPipelineNode`

* `constructor(nodeid, _conf)`
* `to_json()`
* `copy_from_json(_json)`
* `update_cell_xy(pos_x, pos_y)`
* `get_hash_cell_xy()`
* `get_cell_x()`
* `get_cell_y()`
* `set_color(val)`
* `get_color()`
* `set_name(name)`
* `get_name()`
* `set_description(description)`
* `get_description()`
* `update_meansures(_ctx)`
* `nodes_in_same_cells_reset()`
* `nodes_in_same_cells_add(node_id)`
* `get_paralax_in_cell()`
* `outcoming_reset()`
* `outcoming_add(nodeid)`
* `get_paralax_for_line(node_id)`
* `update_incoming_sort(pl_data_render)`
* `draw_card(_ctx, selectedBlockIdEditing)`

### Class `RenderPipelineConfig`

* `constructor()`
* `set_max_cell_xy(x,y)`
* `set_cell_size(width, height)`
* `get_cell_width()`
* `get_cell_height()`
* `get_padding()`
* `set_card_size(width, height)`
* `get_card_width()`
* `get_card_height()`
* `get_radius_for_angels()`

### Class `RenderPipelineDrawedLinesCache`

* `constructor()`
* `add(line)`
* `has_collision(line)`
* `clear()`

### Class `RenderPipelineConnection`

* `constructor(line1, line2, line3, conf, out_nodeid, in_nodeid)`
* `draw(_ctx)`

### Class `RenderPipelineLine`

* `constructor(x0, y0, x1, y1)`
* `set_x0(val)`
* `set_x1(val)`
* `set_y0(val)`
* `set_y1(val)`
* `has_collision(line)`
* `draw_out_circle(_ctx, radius)`
* `draw_line(_ctx)`
* `draw_arrow(_ctx, radius) `
* `draw_arc(_ctx, radius, angle)`

## Other pipeline editors

Nice diagram and something else:

* https://github.com/elyra-ai/examples/tree/master/pipelines/hello_world_kubeflow_pipelines
* https://github.com/elyra-ai/pipeline-editor



Block-scheme editor:

https://draw.io


Plugin for Jenkins

https://www.jenkins.io/doc/book/blueocean/pipeline-editor/


PlantUML
* https://plantuml.com/ru/starting
* http://www.plantuml.com/plantuml/uml/SyfFKj2rKt3CoKnELR1Io4ZDoSa70000
