{
    var generateShape = shapes3dToolbox.generateCuboid5;
    var nodes = [{x: 1, y: 3, z: 1}, {x: 2, y: 3, z: 1}, {x: 2, y: 3, z: 2}, {x: 1, y: 3, z: 2},
        {x: 1, y: 8, z: 1}, {x: 2, y: 8, z: 1}, {x: 2, y: 8, z: 2}, {x: 1, y: 8, z: 2}];
    var triangle_size = 10;
    var shape_params = {scale: 100, nodes: nodes, yTranslate: -10, triangleSize: triangle_size};
//    var shape_params = {scale: 100, lats:30, longs:20, generateUVs: false}; // example for sphere

    var default_color = "#000000";  // color picker : https://www.w3schools.com/colors/colors_picker.asp
    var stroke_value = 1;
    var illo = undefined; // pointer to the main object (for refreshing)
    var mainshape = undefined;  // pointer to the wireframe shape (when it's activated)
    var draw_modes = ['Wireframe', 'Paint'];
    var draw_mode_default = draw_modes[1];
    var spin_modes = ['Spinning', 'Static'];
    var spin_mode_default = spin_modes[0];
    var isSpinning = true;

    var colpicker = document.getElementById("colorpicker");
    if (colpicker) {
        colpicker.value = default_color;
        colpicker.addEventListener('change', function (evt) {
            default_color = this.value;
            if (mainshape) {
                mainshape.color = default_color;
            }
        }, false);
    } else {
        console.warn('color picker not found');
    }

    // Wireframe shape
    function genShape1(obj3d) {
        var datas = [];

        obj3d.polygons.forEach(vertices => {
            vertices.forEach((item) => {
                datas.push(obj3d.points[item]);
            });
        });
        return datas;
    }

    // filled shape
    function genShape2(ref) {
        var obj3d = generateShape(shape_params);

        var colors = chroma.scale(['#9cdf7c', '#2A4858']).mode('lch').colors(obj3d.polygons.length);

        obj3d.polygons.forEach((vertices, idx) => {
            let shape = [];

            vertices.forEach((item) => {
                shape.push(obj3d.points[item]);
            });

            new Zdog.Shape({
                addTo: ref,
                path: shape,
                color: colors[idx],
                closed: false,
                stroke: stroke_value,
                fill: true,
            });
        });
    }

    illo = new Zdog.Illustration({
        element: '.zdog-canvas',
        dragRotate: true,
        // pause spinning while dragging
        //onDragStart: () => isSpinning = false,
        //onDragEnd: () => isSpinning = true
    });

    function generateGraph() {
        illo.children = []; // drop all children before regeneration
        if (draw_mode_default == 'Wireframe') {
            mainshape = new Zdog.Shape({
                addTo: illo,
                path: genShape1(generateShape(shape_params)),
                color: default_color,
                closed: false,
                stroke: stroke_value,
                fill: false,
            });
        } else {
            mainshape = null;
            genShape2(illo);
        }
    }

    generateGraph();

    function draw() {
        if (isSpinning) {
            illo.rotate.z += 0.003;
        }
        illo.updateRenderGraph();
    }

    function animate() {
        draw();
        requestAnimationFrame(animate);
    }

    function resetScale() {
        illo.scale.x = 1;
        illo.scale.y = 1;
        illo.scale.z = 1;
    }

    function keyPressed(e) {

        // Documentation about keyboard events :
        //    https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
        const DOWN_ARROW = 40;
        const LEFT_ARROW = 37;
        const RIGHT_ARROW = 39;
        const UP_ARROW = 38;
        const BACKSPACE = 8;
        const ESCAPE = 27;
        const KEY_ONE = 49;
        const KEY_TWO = 50;
        const KEY_THREE = 51;
        const KEY_FOUR = 52;
        const KEY_FIVE = 53;

        switch (e.keyCode) {
            case ESCAPE: {
                resetScale();
                break;
            }
            case LEFT_ARROW: {
                illo.scale.z += 0.3;
                break;
            }
            case RIGHT_ARROW: {
                illo.scale.z -= 0.3;
                break;
            }
            case UP_ARROW: {
                illo.scale.x += 0.3;
                illo.scale.y += 0.3;
                illo.scale.z += 0.3;
                break;
            }
            case DOWN_ARROW: {
                illo.scale.x -= 0.3;
                illo.scale.y -= 0.3;
                illo.scale.z -= 0.3;
                break;
            }
            case KEY_ONE: {
                stroke_value = 1;
                if (mainshape) {
                    mainshape.stroke = stroke_value;
                }
                break;
            }
            case KEY_TWO: {
                stroke_value = 2;
                if (mainshape) {
                    mainshape.stroke = stroke_value;
                }
                break;
            }
            case KEY_THREE: {
                stroke_value = 3;
                if (mainshape) {
                    mainshape.stroke = stroke_value;
                }
                break;
            }
            case KEY_FOUR: {
                stroke_value = 4;
                if (mainshape) {
                    mainshape.stroke = stroke_value;
                }
                break;
            }
            case KEY_FIVE: {
                stroke_value = 5;
                if (mainshape) {
                    mainshape.stroke = stroke_value;
                }
                break;
            }

        }
    }


    var draw_mode_btn = document.getElementById('drawmode');
    if (draw_mode_btn) {
        if (draw_mode_default == draw_modes[1]) {
            draw_mode_btn.innerHTML = draw_modes[0];
        } else {
            draw_mode_btn.innerHTML = draw_modes[1];
        }
        draw_mode_btn.addEventListener('click', function (evt) {
            let other_mode;
            if (draw_mode_default == draw_modes[0]) {
                draw_mode_default = draw_modes[1];
                other_mode = draw_modes[0];
                colpicker.setAttribute('disabled', 'disabled');
            } else {
                draw_mode_default = draw_modes[0];
                other_mode = draw_modes[1];
                colpicker.removeAttribute('disabled');
            }
            draw_mode_btn.innerHTML = other_mode;
            generateGraph();
        }, false);
    } else {
        console.warn('draw mode button not found');
    }

    var spin_mode_btn = document.getElementById('spinning');
    if (spin_mode_btn) {
        spin_mode_btn.innerHTML = spin_modes[1];
        spin_mode_btn.addEventListener('click', function (evt) {
            evt.preventDefault();
            let other_mode;
            if (spin_mode_default == spin_modes[0]) {
                spin_mode_default = spin_modes[1];
                other_mode = spin_modes[0];
                isSpinning = false;
            } else {
                spin_mode_default = spin_modes[0];
                other_mode = spin_modes[1];
                isSpinning = true;
            }
            spin_mode_btn.innerHTML = other_mode;
            generateGraph();
        }, false);
    } else {
        console.warn('spin mode button not found');
    }

    var trisize = document.getElementById('trisize');
    if (trisize) {
        options = [1, 2, 4, 5, 10, 20];
        options.forEach(item => {
            let option = document.createElement('option');
            option.setAttribute('value', String(item));
            option.innerText = item;
            if (item == triangle_size) {
                option.setAttribute('selected', 'selected');
            }
            trisize.appendChild(option);
        });
        trisize.addEventListener('change', (evt) => {
            evt.preventDefault();
            triangle_size = Number(evt.currentTarget.value);
            console.log(triangle_size);
            shape_params.triangleSize = triangle_size
            generateGraph();
        }, false);
    } else {
        console.warn('select field "trisize " not found');
    }

    document.addEventListener('keydown', keyPressed, false);
    //document.addEventListener('keyup', keyReleased, false);

    document.addEventListener("DOMContentLoaded", function (event) {
        console.log("DOM fully loaded and parsed");
        animate();
    });

}
