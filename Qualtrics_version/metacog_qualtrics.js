/* https://kywch.github.io/jsPsych-in-Qualtrics/hello-world
https://github.com/kywch/jsPsych-in-Qualtrics/blob/master/hello-world/qualtrics.js
https://github.com/Max-Lovell/jsPsych*/

Qualtrics.SurveyEngine.addOnload(function () {

    /*Place your JavaScript here to run when the page loads*/

    /* Change 1: Hiding the Next button */
    // Retrieve Qualtrics object and save in qthis
    var qthis = this;

    // Hide buttons
    qthis.hideNextButton();

    /* Change 2: Defining and load required resources */
    var jslib_url = "https://max-lovell.github.io/jsPsych/";

    var requiredResources = [
        jslib_url + "jspsych.js",
        jslib_url + "plugins/jspsych-html-keyboard-response.js",
        jslib_url + "plugins/jspsych-html-slider-response.js",
        jslib_url + "plugins/jspsych-canvas-keyboard-response.js",
        jslib_url + "plugins/jspsych-fullscreen.js"
    ];
    
    function loadScript(idx) {
        console.log("Loading ", requiredResources[idx]);
        jQuery.getScript(requiredResources[idx], function () {
            if ((idx + 1) < requiredResources.length) {
                loadScript(idx + 1);
            } else {
                initExp();
            }
        });
    }

    if (window.Qualtrics && (!window.frameElement || window.frameElement.id !== "mobile-preview-view")) {
        loadScript(0);
    }

    /* Change 3: Appending the display_stage Div using jQuery */
    // jQuery is loaded in Qualtrics by default
    jQuery("<div id = 'display_stage_background'></div>").appendTo('body');
    jQuery("<div id = 'display_stage'></div>").appendTo('body');


var sbj_id = "${e://Field/workerId}";
var save_url = "https://users.sussex.ac.uk/mel29/exp_data/save_data_hello.php";

function save_data_json() {
    jQuery.ajax({
        method: 'POST',
		dataType: 'json',
        cache: false,
        url: save_url,
        data: {
            file_name: sbj_id + '.json', // the file type should be added
            exp_data: jsPsych.data.get().json()
        }
    });
}
    /* Change 4: Wrapping jsPsych.init() in a function */
function initExp() {

    var timeline = [];
    var resp_keys = ['e','i'];

    var squareWidth = 250;
    var nDots = 4.25;
    var trial_num = 1;
    var block_num = 1;
    //recommend 2 prac and 10 trial for testing
    var num_prac = 2; //26 ; if testing, note trials 6 and 11 are used by staircase changes
    var num_trial =  10; //210 ; if testing, must be multiple of 5 as 5 blocks are used
    var num_total = num_prac+num_trial;

//TRAINING INFO/////////////////////////////////////////////////
    var welcome = {
      type: 'html-keyboard-response',
      stimulus: `Welcome to the task!<br>
        We will now ask you to judge which of two images contains more dots, before asking you to rate your confidence in your judgement.<br>
        At the beginning of each trial, you will be presented with a black cross in the middle of the screen. Focus your attention on it. Then, two black boxes with a number of white dots will be flashed and you will be asked to judge which box had a higher number of dots.<br><br>
        If the box on the <strong>left</strong> had more dots, <strong>press  ` + resp_keys[0] + ` </strong>.<br> If the box on the <strong>right</strong> had more dots, <strong>press  ` + resp_keys[1] + ` </strong>.<br><br>
        Please respond quickly and to the best of your ability.<br>
        You will then rate your confidence in your judgement on a scale with the mouse.<br>
        Please do your best to rate your confidence accurately and do take advantage of the whole rating scale.<br><br>
        Press spacebar to continue.`,
      choices: [' ']
    };

    var prac_intro = {
      type: 'html-keyboard-response',
      stimulus: `We will now ask you to carry out some practice trials. Please respond only when the dots have disappeared.<br>
        In this practice phase we will tell you whether your judgements are right or wrong.<br><br>
        If you are <strong>correct</strong>, the box that you selected will be outlined in <font color="green"><strong>green</strong></font>.<br>
        If you are <strong>incorrect</strong>, the box that you selected will be outlined in <font color="red"><strong>red</strong></font>.<br><br>
        You will not need to rate your confidence of your judgements on these trials.<br><br>
        Press spacebar to continue.`,
      choices: [' ']
    };

    var no_feedback = {
      type: 'html-keyboard-response',
      stimulus: `In the task proper, you will not be provided accuracy feedback on your judgements, but the box you selected will be outlined in <font color="blue"><strong>blue</strong></font>.<br>
      You will be asked to rate your confidence in your judgement on a rating scale after each trial, which will be explained next.<br><br>Press spacebar to continue.`,
      choices: [' ']
    };

    var conf_intro = {
        type: 'html-slider-response',
        stimulus:`A rating scale as shown below is used throughout the task.<br>You will be able to rate your confidence of your judgements by choosing any point along the rating scale with your mouse.<br><br>`,
        prompt: `Choose any point on the rating scale and click ‘Submit’ to continue.<br><br>`,
        min: 1,
        max: 11,
        slider_start: 6,
        slider_width: 800,
        labels: ['1<br>certainly wrong','2','3<br>probably wrong','4','5<br>maybe wrong',
                '6','7<br>maybe correct','8','9<br>probably correct','10','11<br>certainly correct'],
        button_label: 'Submit',
    };

    var exp_cont = {
      type: 'html-keyboard-response',
      stimulus: `You will now continue directly to the experiment. The dots will presented only for a short period of time.<br>
    You will be asked to rate your confidence in your judgement after each trial.<br><br>
    Press spacebar to continue.`,
      choices: [' ']
    };

    var exp_intro = {
      type: 'html-keyboard-response',
      stimulus: `The task proper is divided into 5 blocks of 42 trials, where you 
                    can pause for a break before every block. There are no time limits on your responses to the dots and on your confidence ratings. <br><br>
                    As a reminder: If the box on the left had more dots, <strong>press  ` + resp_keys[0] + ` </strong>. If the box on the right had more dots, <strong>press  ` + resp_keys[1] + ` </strong>.<br><br>
                    Press spacebar to begin!`,
      choices: [' ']
    };

    var end_prac = {
        timeline: [no_feedback,conf_intro,exp_cont,exp_intro],
        conditional_function: function(){
            if(trial_num == num_prac+1) {
            // Splits task into 5 blocks (every 42 trials for 210 trials total), missing the first and last ones
                return true
            } else {
                return false}
        }
    };

//TRIALS/////////////////////////////////////////////////
    var fixation = {
            type: 'html-keyboard-response',
            stimulus: '<div style="font-size:60px;">+</div>',
            choices: jsPsych.NO_KEYS,
            trial_duration: 1000,
        };

    //STIM/////////////////////////////////////////////////
    function drawDots(ctx, x_coord, y_coord, nDots){
        var cellSize = 10;
        var dotIndex = jsPsych.randomization.shuffle([...Array(625).keys()]);
        var y_coord = 145;
        var mat_no = 0;
        for (var x = x_coord ; x < x_coord + squareWidth; x += cellSize){
            for (var y = y_coord ; y < y_coord + squareWidth; y += cellSize){
                if (dotIndex[mat_no] < (312 + nDots)){
                   ctx.beginPath() // stops tearing of the graphics
                   ctx.arc(x + (cellSize/2) , y + (cellSize/2), 2, 0, Math.PI*2);
                   ctx.fillStyle = "white";
                   ctx.fill();
                }
                mat_no++;
            }
        }
    };

    function drawStim(c, side, nDots){
        //Note: This replicates the previous experiment, where the main canvas is 800px wide, auto (596px?) or 600px height
            //stim are drawn on blank canvases W:400px,H:540, left starts at 0,0, and right is right floated
            //stim start point is (canvas_widthORheight-squareWidth)/2. stim box starts at X=75 so right box at is X=475, with both Y=145
        var ctx = c.getContext('2d');
        if (side == 'left'){
            var x_1 = 75;
            var x_2 = 475;
        } else { 
            var x_1 = 475;
            var x_2 = 75;
        };
        var y_coord = 145;
        ctx.fillRect(x_1, y_coord, squareWidth, squareWidth);
        ctx.fillRect(x_2, y_coord, squareWidth, squareWidth);
        drawDots(ctx, x_1, y_coord, nDots);
        drawDots(ctx, x_2, y_coord, 0);
    };

    function staircase(current_dots, back_1, back_2, trial_num){
        if (trial_num < 7){ 
            var step_size = .4;
        } else if (trial_num > 6 && trial_num < 12){
            var step_size = .2
        } else if (trial_num > 11){
            var step_size = .1};

        if (back_1 == true && back_2 == true){
            nDots -= step_size
        } else if (back_1 == false){
            nDots += step_size};

        if (nDots < 1){
            nDots = 1
        } else if (nDots > 4.25){
            nDots = 4.25
        };

        return(nDots)
    }

    var dots = {
        type: 'canvas-keyboard-response',
        canvas_size: [540, 800],
        stimulus: function(c){
            var target_side = jsPsych.timelineVariable('stimulus');
            if (target_side == 'left'){
                var other_side = 'right'
            } else {
                var other_side = 'left'
            };

            if (trial_num > 1){ // if statement stops error being thrown with .correct property
                var one_trial_ago = jsPsych.data.get().filter({task: 'trial'}).last(1).values()[0].correct}
            if (trial_num > 2){
                var two_trial_ago = jsPsych.data.get().filter({task: 'trial'}).last(2).values()[0].correct
            }
            nDots = staircase(nDots, one_trial_ago, two_trial_ago, trial_num);
            drawStim(c, target_side, Math.round(Math.exp(nDots)));
            //press f12 and go to console to see trial number,target side for this trial, correctness for the last 2 trials, and the number of dots (-312 and before exp()) displayed on the target side
                console.log(trial_num);
                console.log(target_side);
                console.log(one_trial_ago);
                console.log(two_trial_ago);
                console.log(nDots)

        },
        prompt: `<p style="position:relative; top:150px"><strong>Press  ` + resp_keys[0] + ` </strong> if the box on the left had more dots.<br><strong>Press  ` + resp_keys[1] + ` </strong> if the box on the right had more dots.</p>`,
        choices: jsPsych.NO_KEYS,
        trial_duration: 300,
        data: {
        task: 'dots',
        },
        on_finish: function(data) {data.number_dots = nDots} //run in on_finish as functions are called before trial otherwise
    };

    //POST-STIM///////////////////////////////////////////////
    var choice = {
        type: 'canvas-keyboard-response',
        canvas_size: [540, 800],
        stimulus: function (c){
                    var ctx = c.getContext('2d');
                    var x_1 = 75;
                    var x_2 = 475;
                    var y_coord = 145;
                    ctx.fillRect(x_1, y_coord, squareWidth, squareWidth);
                    ctx.fillRect(x_2, y_coord, squareWidth, squareWidth);
                },
        choices: resp_keys,
        prompt: `<p style="position:relative; top:150px"><strong>Press  ` + resp_keys[0] + ` </strong> if the box on the left had more dots.<br><strong>Press  ` + resp_keys[1] + ` </strong> if the box on the right had more dots.</p>`,
        data: {
            task: 'trial',
            trial_number: trial_num,
            target_side: jsPsych.timelineVariable('stimulus'),
            correct_response: jsPsych.timelineVariable('correct_response')
        },
        on_finish: function(data){
            // Score the response as correct or incorrect.
            if(jsPsych.pluginAPI.compareKeys(data.response, jsPsych.timelineVariable('correct_response'))){
              data.correct = true;
            } else {
              data.correct = false;
            }
        }
    }

    var feedback = {
        type: 'canvas-keyboard-response',
        canvas_size: [540, 800],
        stimulus: function (c){
                var ctx = c.getContext('2d');
                var x_1 = 75;
                var x_2 = 475;
                var y_coord = 145;
                ctx.fillRect(x_1, y_coord, squareWidth, squareWidth);
                ctx.fillRect(x_2, y_coord, squareWidth, squareWidth);

                if (trial_num <= num_prac){
                    if(jsPsych.data.get().last(1).values()[0].correct){
                        ctx.fillStyle = '#00ff00'
                    } else {ctx.fillStyle = '#ff0000'};
                } else {ctx.fillStyle = '#0000ff'}     

                if (jsPsych.data.get().last(1).values()[0].response == resp_keys[0]){
                    ctx.fillRect(x_1, y_coord, squareWidth, squareWidth)
                } else {
                    ctx.fillRect(x_2, y_coord, squareWidth, squareWidth)
                }
        },
        choices: jsPsych.NO_KEYS,
        trial_duration: 500,
        on_finish: function(data){trial_num++}
    }

    var confid = {
        type: 'html-slider-response',
        stimulus:'Rate your confidence',
        min: 1,
        max: 11,
        slider_start: 6,
        slider_width: 800,
        labels: ['1<br>certainly wrong','2','3<br>probably wrong','4','5<br>maybe wrong',
                '6','7<br>maybe correct','8','9<br>probably correct','10','11<br>certainly correct'],
        button_label: 'Submit'
    };

    var conf = {
        timeline: [confid],
        conditional_function: function(){
            if(trial_num > num_prac+1){
            // Splits task into 5 blocks (every 42 trials for 210 trials total), missing the first and last ones
                return true
            } else {
                return false}
        }
    };

    //BREAK///////////////////////////////////////////////
    var trial_break = {
        type: 'html-keyboard-response',
        stimulus: function(){ //must be a function to return the updated block_num
            return `You can now pause for a break. You have completed ` + block_num + ` out of 
        5 blocks.<br><br> As a reminder:<br>If the box on the left had more dots, <strong>press  ` + resp_keys[0] + ` </strong>.<br> If the box on the right had more dots, <strong>press  ` + resp_keys[1] + ` </strong>.<br><br>Press spacebar to continue the task`},
        choices: [' '],
        on_finish: function(data){block_num++}
    };

    var block = {
        timeline: [trial_break],
        conditional_function: function(){
            if(((trial_num-1)-num_prac)%(num_trial/5) == 0 && trial_num > (num_prac+1) && trial_num < num_total) {
            // Splits task into 5 blocks (every 42 trials for 210 trials total), missing the first and last ones
                return true
            } else {
                return false}
        }
    };

    //CREATING EXPERIMENT///////////////////////////////////////////////
    var trial_procedure = {
        timeline: [end_prac, block, fixation, dots, choice, feedback, conf],
        timeline_variables: [{stimulus: 'left', correct_response: resp_keys[0]},
                             {stimulus: 'right', correct_response: resp_keys[1]}],
        repetitions: num_total/2,
        randomize_order: true,
        type: 'with-replacement'
    };

   timeline.push({ //prompts full screen
       type: 'fullscreen',
       fullscreen_mode: true
   });

    timeline.push(welcome, prac_intro, trial_procedure);

    jsPsych.init({
      timeline: timeline,
      display_element: 'display_stage', //https://kywch.github.io/jsPsych-in-Qualtrics/hello-world/
        on_finish: function() {
            
            jsPsych.data.get().addToLast({participant: sbj_id});
            save_data_json();
            
            // clear the stage
            jQuery('display_stage').remove();
            jQuery('display_stage_background').remove();
            // simulate click on Qualtrics "next" button, making use of the Qualtrics JS API
            qthis.clickNextButton();
        },
    });
    }
});


Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/

});

Qualtrics.SurveyEngine.addOnUnload(function()
{
    /*Place your JavaScript here to run when the page is unloaded*/

});