# pipeline-editor-s5

[![Total alerts](https://img.shields.io/lgtm/alerts/g/sea-kg/pipeline-editor-s5.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/sea-kg/pipeline-editor-s5/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/sea-kg/pipeline-editor-s5.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/sea-kg/pipeline-editor-s5/context:javascript) [![npm](https://img.shields.io/npm/v/pipeline-editor-s5)](https://www.npmjs.com/package/pipeline-editor-s5)

Pipeline Editor (just editor)

html:

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