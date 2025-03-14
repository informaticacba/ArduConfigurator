//'use strict';

const SERVO_GIMBAL_PITCH = 0,
    SERVO_GIMBAL_ROLL = 1,
    SERVO_ELEVATOR = 2,
    SERVO_FLAPPERON_1 = 3,
    SERVO_FLAPPERON_2 = 4,
    SERVO_RUDDER = 5,
    SERVO_BICOPTER_LEFT = 4,
    SERVO_BICOPTER_RIGHT = 5,
    SERVO_DUALCOPTER_LEFT = 4,
    SERVO_DUALCOPTER_RIGHT = 5,
    SERVO_SINGLECOPTER_1 = 3,
    SERVO_SINGLECOPTER_2 = 4,
    SERVO_SINGLECOPTER_3 = 5,
    SERVO_SINGLECOPTER_4 = 6;

const INPUT_STABILIZED_ROLL = 0,
    INPUT_STABILIZED_PITCH = 1,
    INPUT_STABILIZED_YAW = 2,
    INPUT_STABILIZED_THROTTLE = 3,
    INPUT_RC_ROLL = 4,
    INPUT_RC_PITCH = 5,
    INPUT_RC_YAW = 6,
    INPUT_RC_THROTTLE = 7,
    INPUT_RC_AUX1 = 8,
    INPUT_RC_AUX2 = 9,
    INPUT_RC_AUX3 = 10,
    INPUT_RC_AUX4 = 11,
    INPUT_GIMBAL_PITCH = 12,
    INPUT_GIMBAL_ROLL = 13,
    INPUT_FEATURE_FLAPS = 14;

const
    PLATFORM_MULTIROTOR     = 0,
    PLATFORM_AIRPLANE       = 1,
    PLATFORM_HELICOPTER     = 2,
    PLATFORM_TRICOPTER      = 3,
    PLATFORM_ROVER          = 4,
    PLATFORM_BOAT           = 5,
    PLATFORM_OTHER          = 6;

// cut-n-pasted from https://ardupilot.org/copter/docs/parameters.html#frame-class july 2021
// values for FRAME_CLASS param.
const ardu_frame_classes = {
    0:	'Undefined',
    1:	'Quad',
    2:	'Hexa',
    3:	'Octa',
    4:	'OctaQuad',
    5:	'Y6',
    6:	'Heli',
    7:	'Tri',
    8:	'SingleCopter',
    9:	'CoaxCopter',
    10:	'BiCopter',
    11:	'Heli_Dual',
    12:	'DodecaHexa',
    13:	'HeliQuad',
    14:	'Deca',
    15:	'Scripting Matrix',
    16:	'6DoF Scripting'
};
// cut-n-pasted from https://ardupilot.org/copter/docs/parameters.html#frame-type july 2021
// values for FRAME_TYPE param.
const ardu_frame_types = {
    0:	'Plus',
    1:	'X',
    2:	'V',
    3:	'H',
    4:	'V-Tail',
    5:	'A-Tail',
    10:	'Y6B',
    11:	'Y6F',
    12:	'BetaFlightX',
    13:	'DJIX',
    14:	'ClockwiseX',
    15:	'I',
    18:	'BetaFlightXReversed',
    99: '' //use this for 'undefined' or 'unused'
    
};


// generate mixer, a mixER basically defines how many MOTORS and SERVOs you have and the 'range' of min/max/reverse/etc for each of these.
const mixerList = [
    {
        id: 1,
        name: 'Tricopter',
        model: 'tricopter',
        image: 'tri',
        enabled: true,
        legacy: true,
        platform: PLATFORM_TRICOPTER,
        frame_class: 'Tri', //FRAME_CLASS=7
        frame_type: '',  //FRAME_TYPE=???  buzz todo is -1 ok here?
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 1.333333, 0.0),     // REAR
            new MotorMixRule(1.0, -1.0, -0.666667, 0.0),   // RIGHT
            new MotorMixRule(1.0, 1.0, -0.666667, 0.0),    // LEFT
        ],
        servoMixer: [
            new ServoMixRule(SERVO_RUDDER, INPUT_STABILIZED_YAW, 100, 0),
        ]
    },            // 1
    {
        id: 3,
        name: 'Quad X',
        model: 'quad_x',
        image: 'quad_x',
        enabled: true,
        legacy: true,
        platform: PLATFORM_MULTIROTOR,
        frame_class: 'Quad', //FRAME_CLASS=1
        frame_type: 'X',  //FRAME_TYPE=1
        motorMixer: [
            new MotorMixRule(1.0, -1.0, 1.0, -1.0),          // REAR_R
            new MotorMixRule(1.0, -1.0, -1.0, 1.0),          // FRONT_R
            new MotorMixRule(1.0, 1.0, 1.0, 1.0),            // REAR_L
            new MotorMixRule(1.0, 1.0, -1.0, -1.0),          // FRONT_L
        ],
        servoMixer: []
    },               // 3
    {
        id: 2,
        name: 'Quad +',
        model: 'quad_x',
        image: 'quad_p',
        enabled: true,
        legacy: true,
        platform: PLATFORM_MULTIROTOR,
        frame_class: 'Quad', //FRAME_CLASS=1
        frame_type: 'Plus',  //FRAME_TYPE=0
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 1.0, -1.0),          // REAR
            new MotorMixRule(1.0, -1.0, 0.0, 1.0),          // RIGHT
            new MotorMixRule(1.0, 1.0, 0.0, 1.0),           // LEFT
            new MotorMixRule(1.0, 0.0, -1.0, -1.0),         // FRONT
        ],
        servoMixer: []
    },               // 2
    // {
    //     id: 4,
    //     name: 'Bicopter',
    //     model: 'custom',
    //     image: 'bicopter',
    //     enabled: false,
    //     legacy: true,
    //     platform: PLATFORM_MULTIROTOR,
    //     motorMixer: [],
    //     servoMixer: []
    // },           // 4
    // {
    //     id: 5,
    //     name: 'Gimbal',
    //     model: 'custom',
    //     image: 'custom',
    //     enabled: false,
    //     legacy: true,
    //     platform: PLATFORM_OTHER,
    //     motorMixer: [],
    //     servoMixer: []
    // },               // 5
    {
        id: 6,
        name: 'Y6',
        model: 'y6',
        image: 'y6',
        enabled: true,
        legacy: true,
        platform: PLATFORM_MULTIROTOR,
        frame_class: 'Y6', //FRAME_CLASS=5
        frame_type: 'X',  //X=1=Y6A. FRAME_TYPE=1  ( alternative could be 'Y6B'=10 FRAME_TYPE=10 )
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 1.333333, 1.0),      // REAR
            new MotorMixRule(1.0, -1.0, -0.666667, -1.0),   // RIGHT
            new MotorMixRule(1.0, 1.0, -0.666667, -1.0),    // LEFT
            new MotorMixRule(1.0, 0.0, 1.333333, -1.0),     // UNDER_REAR
            new MotorMixRule(1.0, -1.0, -0.666667, 1.0),    // UNDER_RIGHT
            new MotorMixRule(1.0, 1.0, -0.666667, 1.0),     // UNDER_LEFT
        ],
        servoMixer: []
    },                           // 6
    {
        id: 7,
        name: 'Hex +',
        model: 'hex_plus',
        image: 'hex_p',
        enabled: true,
        legacy: true,
        platform: PLATFORM_MULTIROTOR,
        frame_class: 'Hexa', //FRAME_CLASS=2
        frame_type: 'Plus',  //FRAME_TYPE=0
        motorMixer: [
            new MotorMixRule(1.0, -0.866025, 0.5, 1.0),     // REAR_R
            new MotorMixRule(1.0, -0.866025, -0.5, -1.0),   // FRONT_R
            new MotorMixRule(1.0, 0.866025, 0.5, 1.0),      // REAR_L
            new MotorMixRule(1.0, 0.866025, -0.5, -1.0),    // FRONT_L
            new MotorMixRule(1.0, 0.0, -1.0, 1.0),          // FRONT
            new MotorMixRule(1.0, 0.0, 1.0, -1.0),          // REAR
        ],
        servoMixer: []
    },               // 7
    {
        id: 8,
        name: 'Flying Wing',
        model: 'flying_wing',
        image: 'flying_wing',
        enabled: true,
        legacy: true,
        platform: PLATFORM_AIRPLANE,
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 0.0, 0.0),
            //new MotorMixRule(1.0, 0.0, 0.0, 0.0),
        ],
        servoMixer: [
            new ServoMixRule(SERVO_FLAPPERON_1, INPUT_STABILIZED_ROLL,  50, 0),
            new ServoMixRule(SERVO_FLAPPERON_1, INPUT_STABILIZED_PITCH, 50, 0),
            new ServoMixRule(SERVO_FLAPPERON_2, INPUT_STABILIZED_ROLL, -50, 0),
            new ServoMixRule(SERVO_FLAPPERON_2, INPUT_STABILIZED_PITCH, 50, 0),
        ]
    },     // 8
    {
        id: 27,
        name: 'Flying Wing with differential thrust',
        model: 'flying_wing',
        image: 'flying_wing',
        enabled: true,
        legacy: false,
        platform: PLATFORM_AIRPLANE,
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 0.0, 0.1),
            new MotorMixRule(1.0, 0.0, 0.0, -0.1)
        ],
        servoMixer: [
            new ServoMixRule(SERVO_FLAPPERON_1, INPUT_STABILIZED_ROLL,  50, 0),
            new ServoMixRule(SERVO_FLAPPERON_1, INPUT_STABILIZED_PITCH, 50, 0),
            new ServoMixRule(SERVO_FLAPPERON_2, INPUT_STABILIZED_ROLL, -50, 0),
            new ServoMixRule(SERVO_FLAPPERON_2, INPUT_STABILIZED_PITCH, 50, 0),
        ]
    },     // 27
    // {
    //     id: 9,
    //     name: 'Y4',
    //     model: 'y4',
    //     image: 'y4',
    //     enabled: true,
    //     legacy: true,
    //     platform: PLATFORM_MULTIROTOR,
    //     frame_class: '', //FRAME_CLASS=???
    //     frame_type: '',  //FRAME_TYPE=???
    //     motorMixer: [
    //         new MotorMixRule(1.0, 0.0, 1.0, -1.0),          // REAR_TOP CW
    //         new MotorMixRule(1.0, -1.0, -1.0, 0.0),          // FRONT_R CCW
    //         new MotorMixRule(1.0, 0.0, 1.0, 1.0),          // REAR_BOTTOM CCW
    //         new MotorMixRule(1.0, 1.0, -1.0, 0.0),          // FRONT_L CW
    //     ],
    //     servoMixer: []
    // },                           // 9
    {
        id: 10,
        name: 'Hex X',
        model: 'hex_x',
        image: 'hex_x',
        enabled: true,
        legacy: true,
        platform: PLATFORM_MULTIROTOR,
        frame_class: 'Hexa', //FRAME_CLASS=2
        frame_type: 'X',  //FRAME_TYPE=1
        motorMixer: [
            new MotorMixRule(1.0, -0.5, 0.866025, 1.0),     // REAR_R
            new MotorMixRule(1.0, -0.5, -0.866025, 1.0),     // FRONT_R
            new MotorMixRule(1.0, 0.5, 0.866025, -1.0),     // REAR_L
            new MotorMixRule(1.0, 0.5, -0.866025, -1.0),     // FRONT_L
            new MotorMixRule(1.0, -1.0, 0.0, -1.0),     // RIGHT
            new MotorMixRule(1.0, 1.0, 0.0, 1.0),     // LEFT
        ],
        servoMixer: []
    },                  // 10
    {
        id: 11,
        name: 'Octo X8', // 8 arms, not 4
        model: 'custom',
        image: 'octo_x8',
        enabled: true,
        legacy: true,
        platform: PLATFORM_MULTIROTOR,
        frame_class: 'Octa', //FRAME_CLASS=3
        frame_type: 'X',  //FRAME_TYPE=1
        motorMixer: [
            new MotorMixRule(1.0, -1.0, 1.0, -1.0),          // REAR_R
            new MotorMixRule(1.0, -1.0, -1.0, 1.0),          // FRONT_R
            new MotorMixRule(1.0, 1.0, 1.0, 1.0),          // REAR_L
            new MotorMixRule(1.0, 1.0, -1.0, -1.0),          // FRONT_L
            new MotorMixRule(1.0, -1.0, 1.0, 1.0),          // UNDER_REAR_R
            new MotorMixRule(1.0, -1.0, -1.0, -1.0),          // UNDER_FRONT_R
            new MotorMixRule(1.0, 1.0, 1.0, -1.0),          // UNDER_REAR_L
            new MotorMixRule(1.0, 1.0, -1.0, 1.0),          // UNDER_FRONT_L
        ],
        servoMixer: []
    },             // 11
    {
        id: 12,
        name: 'Octo Flat +',  // 8 arms, not 4
        model: 'custom',
        image: 'octo_flat_p',
        enabled: true,
        legacy: true,
        platform: PLATFORM_MULTIROTOR,
        frame_class: 'Octa', //FRAME_CLASS=3
        frame_type: 'Plus',  //FRAME_TYPE=0
        motorMixer: [
            new MotorMixRule(1.0, 0.707107, -0.707107, 1.0),    // FRONT_L
            new MotorMixRule(1.0, -0.707107, -0.707107, 1.0),    // FRONT_R
            new MotorMixRule(1.0, -0.707107, 0.707107, 1.0),    // REAR_R
            new MotorMixRule(1.0, 0.707107, 0.707107, 1.0),    // REAR_L
            new MotorMixRule(1.0, 0.0, -1.0, -1.0),              // FRONT
            new MotorMixRule(1.0, -1.0, 0.0, -1.0),              // RIGHT
            new MotorMixRule(1.0, 0.0, 1.0, -1.0),              // REAR
            new MotorMixRule(1.0, 1.0, 0.0, -1.0),              // LEFT
        ],
        servoMixer: []
    },     // 12
    {
        id: 13,
        name: 'Octo-Quad X', // 8 motors,4 arms
        model: 'custom',
        image: 'tba',  // was octo_flat_x
        enabled: true,
        legacy: true,
        platform: PLATFORM_MULTIROTOR,
        frame_class: 'OctaQuad', //FRAME_CLASS=4
        frame_type: 'X',  //FRAME_TYPE=1
        motorMixer: [
            // buzz todo this entire set of 8 mixers is probably wrong it was for a octo_flat_x
            new MotorMixRule(1.0, 1.0, -0.414178, 1.0),      // MIDFRONT_L
            new MotorMixRule(1.0, -0.414178, -1.0, 1.0),      // FRONT_R
            new MotorMixRule(1.0, -1.0, 0.414178, 1.0),      // MIDREAR_R
            new MotorMixRule(1.0, 0.414178, 1.0, 1.0),      // REAR_L
            new MotorMixRule(1.0, 0.414178, -1.0, -1.0),      // FRONT_L
            new MotorMixRule(1.0, -1.0, -0.414178, -1.0),      // MIDFRONT_R
            new MotorMixRule(1.0, -0.414178, 1.0, -1.0),      // REAR_R
            new MotorMixRule(1.0, 1.0, 0.414178, -1.0),      // MIDREAR_L
        ],
        servoMixer: []
    },     // 13
    {
        id: 14,
        name: 'Airplane / single prop',
       // model: 'custom',
        model: 'bixler',
        image: 'airplane',
        enabled: true,
        legacy: true,
        platform: PLATFORM_AIRPLANE,
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 0.0, 0.0),
            //new MotorMixRule(1.0, 0.0, 0.0, 0.0),
        ],
        servoMixer: [
            new ServoMixRule(SERVO_ELEVATOR,    INPUT_STABILIZED_PITCH, 100, 0),
            new ServoMixRule(SERVO_FLAPPERON_1, INPUT_STABILIZED_ROLL,  100, 0),
            new ServoMixRule(SERVO_FLAPPERON_1, INPUT_FEATURE_FLAPS,    100, 0),
            new ServoMixRule(SERVO_FLAPPERON_2, INPUT_STABILIZED_ROLL,  100, 0),
            new ServoMixRule(SERVO_FLAPPERON_2, INPUT_FEATURE_FLAPS,   -100, 0),
            new ServoMixRule(SERVO_RUDDER,      INPUT_STABILIZED_YAW,   100, 0),
        ]
    },           // 14
    {
        id: 15,
        name: 'Heli 120',
        model: 'custom',
        image: 'custom',
        enabled: false,
        legacy: true,
        platform: PLATFORM_HELICOPTER,
        frame_class: 'Heli', //FRAME_CLASS=6
        frame_type: '',  //FRAME_TYPE=???
        motorMixer: [],
        servoMixer: []
    },             // 15
    {
        id: 16,
        name: 'Heli 90',
        model: 'custom',
        image: 'custom',
        enabled: false,
        legacy: true,
        platform: PLATFORM_HELICOPTER,
        frame_class: 'Heli', //FRAME_CLASS=6
        frame_type: '',  //FRAME_TYPE=???
        motorMixer: [],
        servoMixer: []
    },              // 16
    // {
    //     id: 17,
    //     name: 'V-tail Quad',
    //     model: 'quad_vtail',
    //     image: 'vtail_quad',
    //     enabled: true,
    //     legacy: true,
    //     platform: PLATFORM_MULTIROTOR,
    //     motorMixer: [
    //         new MotorMixRule(1.0, -0.58, 0.58, 1.0),        // REAR_R
    //         new MotorMixRule(1.0, -0.46, -0.39, -0.5),       // FRONT_R
    //         new MotorMixRule(1.0, 0.58, 0.58, -1.0),        // REAR_L
    //         new MotorMixRule(1.0, 0.46, -0.39, 0.5),         // FRONT_L
    //     ],
    //     servoMixer: []
    // },  // 17
    // {
    //     id: 18,
    //     name: 'Hex H',
    //     model: 'custom',
    //     image: 'custom',
    //     enabled: true,
    //     legacy: true,
    //     platform: PLATFORM_MULTIROTOR,
    //     motorMixer: [
    //         new MotorMixRule(1.0, -1.0, 1.0, -1.0),     // REAR_R
    //         new MotorMixRule(1.0, -1.0, -1.0, 1.0),     // FRONT_R
    //         new MotorMixRule(1.0, 1.0, 1.0, 1.0),     // REAR_L
    //         new MotorMixRule(1.0, 1.0, -1.0, -1.0),     // FRONT_L
    //         new MotorMixRule(1.0, 0.0, 0.0, 0.0),     // RIGHT
    //         new MotorMixRule(1.0, 0.0, 0.0, 0.0),     // LEFT
    //     ],
    //     servoMixer: []
    // },                // 18
    // {
    //     id: 17,
    //     name: 'PPM to SERVO',
    //     model: 'custom',
    //     image: 'custom',
    //     enabled: false,
    //     legacy: true,
    //     platform: PLATFORM_OTHER,
    //     motorMixer: [],
    //     servoMixer: []
    // },         // 17
    // {
    //     id: 18,
    //     name: 'Dualcopter',
    //     model: 'custom',
    //     image: 'custom',
    //     enabled: false,
    //     legacy: true,
    //     platform: PLATFORM_MULTIROTOR,
    //     motorMixer: [],
    //     servoMixer: []
    // },           // 18
    // {
    //     id: 19,
    //     name: 'Singlecopter',
    //     model: 'custom',
    //     image: 'custom',
    //     enabled: false,
    //     legacy: true,
    //     platform: PLATFORM_MULTIROTOR,
    //     motorMixer: [],
    //     servoMixer: []
    // },         // 19
    {
        id: 20,
        name: 'QuadPlane - no tilting props, 1 forward + 4 lifting',
        model: 'alti',
        image: 'quad_x',
        enabled: true,
        legacy: true,
        platform: PLATFORM_AIRPLANE, //PLATFORM_MULTIROTOR,
        // frame_class: '', //FRAME_CLASS=???
        // frame_type: '',  //FRAME_TYPE=???
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 0.0, 0.0),          // front buzz todo
            new MotorMixRule(1.0, 0.0, 1.0, 1.0),          // REAR_R
            new MotorMixRule(1.0, -1.0, -1.0, 0.0),        // FRONT_R
            new MotorMixRule(1.0, 0.0, 1.0, -1.0),         // REAR_L
            new MotorMixRule(1.0, 1.0, -1.0, -0.0),        // FRONT_L
        ],
        servoMixer: [ // AETR surfaces too
            new ServoMixRule(SERVO_ELEVATOR,    INPUT_STABILIZED_PITCH, 100, 0),
            new ServoMixRule(SERVO_FLAPPERON_1, INPUT_STABILIZED_ROLL,  100, 0),
            new ServoMixRule(SERVO_FLAPPERON_2, INPUT_STABILIZED_ROLL,  100, 0),
            new ServoMixRule(SERVO_RUDDER,      INPUT_STABILIZED_YAW,   100, 0),
        ]
    },  // 20    
    {
        id: 21,
        name: 'QuadPlane - 4  motors, 2 tilting',
        model: 'griffin',
        image: 'quad_x',
        enabled: true,
        legacy: true,
        platform: PLATFORM_AIRPLANE, //PLATFORM_MULTIROTOR,
        // frame_class: '', //FRAME_CLASS=???
        // frame_type: '',  //FRAME_TYPE=???
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 1.0, 1.0),          // REAR_R // buzz todo tilt
            new MotorMixRule(1.0, -1.0, -1.0, 0.0),        // FRONT_R
            new MotorMixRule(1.0, 0.0, 1.0, -1.0),         // REAR_L
            new MotorMixRule(1.0, 1.0, -1.0, -0.0),        // FRONT_L
        ],
        servoMixer: [ // AETR surfaces too
            new ServoMixRule(SERVO_ELEVATOR,    INPUT_STABILIZED_PITCH, 100, 0),
            new ServoMixRule(SERVO_FLAPPERON_1, INPUT_STABILIZED_ROLL,  100, 0),
            new ServoMixRule(SERVO_FLAPPERON_2, INPUT_STABILIZED_ROLL,  100, 0),
            new ServoMixRule(SERVO_RUDDER,      INPUT_STABILIZED_YAW,   100, 0),
        ]
    },  // 21    
    // {
    //     id: 22,
    //     name: 'QuadPlane - one fixed forward prop / VTOL - 4 fixed lifting props',
    //     model: 'alti',
    //     image: 'quad_x',
    //     enabled: true,
    //     legacy: true,
    //     platform: PLATFORM_AIRPLANE, //PLATFORM_MULTIROTOR,
        // frame_class: '', //FRAME_CLASS=???
        // frame_type: '',  //FRAME_TYPE=???
    //     motorMixer: [
    //         new MotorMixRule(1.0, 0.0, 0.0, 0.0),          // front buzz todo
    //         new MotorMixRule(1.0, 0.0, 1.0, 1.0),          // REAR_R
    //         new MotorMixRule(1.0, -1.0, -1.0, 0.0),        // FRONT_R
    //         new MotorMixRule(1.0, 0.0, 1.0, -1.0),         // REAR_L
    //         new MotorMixRule(1.0, 1.0, -1.0, -0.0),        // FRONT_L
    //     ],
    //     servoMixer: [ // AETR surfaces too
    //         new ServoMixRule(SERVO_ELEVATOR,    INPUT_STABILIZED_PITCH, 100, 0),
    //         new ServoMixRule(SERVO_FLAPPERON_1, INPUT_STABILIZED_ROLL,  100, 0),
    //         new ServoMixRule(SERVO_FLAPPERON_2, INPUT_STABILIZED_ROLL,  100, 0),
    //         new ServoMixRule(SERVO_RUDDER,      INPUT_STABILIZED_YAW,   100, 0),
    //     ]
    // },  // 22
    {
        id: 23,
        name: 'Custom',
        model: 'custom',
        image: 'custom',
        enabled: false,
        legacy: true,
        platform: PLATFORM_MULTIROTOR,
        motorMixer: [],
        servoMixer: []
    },               // 23
    {
        id: 24,
        name: 'Airplane / single prop, tail dragger, flaps',
       // model: 'custom',
        model: 'cub',
        image: 'airplane',
        enabled: true,
        legacy: true,
        platform: PLATFORM_AIRPLANE,
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 0.0, 0.0),
            //new MotorMixRule(1.0, 0.0, 0.0, 0.0),
        ],
        servoMixer: [
            new ServoMixRule(SERVO_ELEVATOR,    INPUT_STABILIZED_PITCH, 100, 0),
            new ServoMixRule(SERVO_FLAPPERON_1, INPUT_STABILIZED_ROLL,  100, 0),
            new ServoMixRule(SERVO_FLAPPERON_1, INPUT_FEATURE_FLAPS,    100, 0),
            new ServoMixRule(SERVO_FLAPPERON_2, INPUT_STABILIZED_ROLL,  100, 0),
            new ServoMixRule(SERVO_FLAPPERON_2, INPUT_FEATURE_FLAPS,   -100, 0),
            new ServoMixRule(SERVO_RUDDER,      INPUT_STABILIZED_YAW,   100, 0),
        ]
    },           // 24
    {
        id: 25,
        name: 'Custom Airplane / diy mixer',
        model: 'custom',
        image: 'custom',
        enabled: true,
        legacy: true,
        platform: PLATFORM_AIRPLANE,
        motorMixer: [],
        servoMixer: []
    },      // 25
    {
        id: 26,
        name: 'Custom Tricopter / diy mixer',
        model: 'custom',
        image: 'custom',
        enabled: false,
        legacy: true,
        platform: PLATFORM_TRICOPTER,
        frame_class: 'Tri', //FRAME_CLASS=7
        frame_type: '',  //FRAME_TYPE=???
        motorMixer: [],
        servoMixer: []
    },      // 26
    {
        id: 27,
        name: 'Airplane with differential thrust',
        model: 'custom',
        image: 'airplane',
        enabled: true,
        legacy: false,
        platform: PLATFORM_AIRPLANE,
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 0.0, 0.3),
            new MotorMixRule(1.0, 0.0, 0.0, -0.3)
        ],
        servoMixer: [
            new ServoMixRule(SERVO_ELEVATOR,    INPUT_STABILIZED_PITCH, 100, 0),
            new ServoMixRule(SERVO_FLAPPERON_1, INPUT_STABILIZED_ROLL,  100, 0),
            new ServoMixRule(SERVO_FLAPPERON_1, INPUT_FEATURE_FLAPS,    100, 0),
            new ServoMixRule(SERVO_FLAPPERON_2, INPUT_STABILIZED_ROLL,  100, 0),
            new ServoMixRule(SERVO_FLAPPERON_2, INPUT_FEATURE_FLAPS,   -100, 0),
            new ServoMixRule(SERVO_RUDDER,      INPUT_STABILIZED_YAW,   100, 0),
        ]
    }, // end 27
    {
        id: 28,
        name: 'Airplane V-tail (individual aileron servos)',
        model: 'talon',
        image: 'airplane_vtail',
        enabled: true,
        legacy: false,
        platform: PLATFORM_AIRPLANE,
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 0.0, 0.0),
        ],
        servoMixer: [
            new ServoMixRule(2, INPUT_STABILIZED_ROLL,  100, 0),
            new ServoMixRule(3, INPUT_STABILIZED_ROLL,  100, 0),
            new ServoMixRule(4, INPUT_STABILIZED_PITCH, 50, 0),
            new ServoMixRule(4, INPUT_STABILIZED_YAW,   -50, 0),
            new ServoMixRule(5, INPUT_STABILIZED_PITCH, -50, 0),
            new ServoMixRule(5, INPUT_STABILIZED_YAW,   -50, 0)
        ]
    }, // end 28
    {
        id: 29,
        name: 'Airplane V-tail (single aileron servo)',
        model: 'talon',
        image: 'airplane_vtail_single',
        enabled: true,
        legacy: false,
        platform: PLATFORM_AIRPLANE,
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 0.0, 0.0),
        ],
        servoMixer: [
            new ServoMixRule(2, INPUT_STABILIZED_ROLL,  100, 0),
            new ServoMixRule(3, INPUT_STABILIZED_PITCH, 50, 0),
            new ServoMixRule(3, INPUT_STABILIZED_YAW,   -50, 0),
            new ServoMixRule(4, INPUT_STABILIZED_PITCH, -50, 0),
            new ServoMixRule(4, INPUT_STABILIZED_YAW,   -50, 0),
        ]
    }, // end 29
    {
        id: 30,
        name: 'Airplane without rudder',
        model: 'custom',
        image: 'airplane_norudder',
        enabled: true,
        legacy: false,
        platform: PLATFORM_AIRPLANE,
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 0.0, 0.0),
        ],
        servoMixer: [
            new ServoMixRule(SERVO_ELEVATOR,    INPUT_STABILIZED_PITCH, 100, 0),
            new ServoMixRule(SERVO_FLAPPERON_1, INPUT_STABILIZED_ROLL,  100, 0),
            new ServoMixRule(SERVO_FLAPPERON_2, INPUT_STABILIZED_ROLL,  100, 0),
        ]
    }, // end 30
    {
        id: 31,
        name: 'Rover / steering-wheel and throttle',
        model: 'custom',
        image: 'custom',
        enabled: true,
        legacy: false,
        platform: PLATFORM_ROVER,
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 0.0, 0.0),
        ],
        servoMixer: [
            new ServoMixRule(3, INPUT_STABILIZED_YAW,  100, 0),
        ]
    }, // end 31
    {
        id: 32,
        name: 'Rover / skid-steer / tank-tracked',
        model: 'custom',
        image: 'custom',
        enabled: true,
        legacy: false,
        platform: PLATFORM_ROVER,
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 0.0, 0.0),
            new MotorMixRule(1.0, 0.0, 0.0, 0.0),
        ],
        servoMixer: [
            new ServoMixRule(3, INPUT_STABILIZED_YAW,  100, 0), // buzz todo rover tank mixer
            new ServoMixRule(3, INPUT_STABILIZED_YAW,  100, 0),
        ]
    }, // end 32
    {
        id: 33,
        name: 'Boat',
        model: 'custom',
        image: 'custom',
        enabled: true,
        legacy: false,
        platform: PLATFORM_BOAT,
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 0.0, 0.0),
        ],
        servoMixer: [
            new ServoMixRule(3, INPUT_STABILIZED_YAW,  100, 0),
        ]
    }    // end 33
    ,
    {
        id: 34,
        name: 'Other',
        model: 'custom',
        image: 'custom',
        enabled: true,
        legacy: false,
        platform: PLATFORM_OTHER,
        motorMixer: [
            new MotorMixRule(1.0, 0.0, 0.0, 0.0),
        ],
        servoMixer: [
            new ServoMixRule(3, INPUT_STABILIZED_YAW,  100, 0),
        ]
    }         // end 34        
];

const platformList = [
    {
        id: 0,
        name: "Multirotor",
        enabled: true,
        flapsPossible: false,
        // frame_class_possible: true,
        // frame_type_possible: true
    },
    {
        id: 1,
        name: "Airplane",
        enabled: true,
        flapsPossible: true
    },
    {
        id: 2,
        name: "Helicopter",
        enabled: false,
        flapsPossible: false,
        // frame_class_possible: true,
        // frame_type_possible: true
    },
    {
        id: 3,
        name: "Tricopter",
        enabled: true,
        flapsPossible: false,
        // frame_class_possible: true,
        // frame_type_possible: true
    },
    {
        id: 4,
        name: "Rover",
        enabled: true,
        flapsPossible: false
    },
    {
        id: 5,
        name: "Boat",
        enabled: true,
        flapsPossible: false
    },
    {
        id: 6,
        name: "Other",
        enabled: true,
        flapsPossible: false
    }
];

var helper = helper || {};

helper.mixer = (function (mixerList) {
    let publicScope = {},
        privateScope = {};

    publicScope.getLegacyList = function () {
        let retVal = [];
        for (const i in mixerList) {
            if (mixerList.hasOwnProperty(i)) {
                let element = mixerList[i];
                if (element.legacy) {
                    retVal.push(element);
                }
            }
        }
        return retVal;
    };

    publicScope.getList = function () {
        let retVal = [];
        for (const i in mixerList) {
            if (mixerList.hasOwnProperty(i)) {
                let element = mixerList[i];
                if (element.enabled) {
                    retVal.push(element);
                }
            }
        }
        return retVal;
    };

    publicScope.getById = function (id) {
        for (const i in mixerList) {
            if (mixerList.hasOwnProperty(i)) {
                let element = mixerList[i];
                if (element.id === id) {
                    return element;
                }
            }
        }
        return false;
    }

    publicScope.getByPlatform = function (platform) {
        let retVal = [];
        for (const i in mixerList) {
            if (mixerList.hasOwnProperty(i)) {
                let element = mixerList[i];
                if (element.platform === platform && element.enabled) {
                    retVal.push(element);
                }
            }
        }
        return retVal;
    };

    publicScope.loadServoRules = function (mixer) {
        SERVO_RULES.flush();

        for (const i in mixer.servoMixer) {
            if (mixer.servoMixer.hasOwnProperty(i)) {
                const r = mixer.servoMixer[i];
                SERVO_RULES.put(
                    new ServoMixRule(
                        r.getTarget(),
                        r.getInput(),
                        r.getRate(),
                        r.getSpeed()
                    )
                );
            }
        }
    }

    publicScope.loadMotorRules = function (mixer) {
        MOTOR_RULES.flush();

        for (const i in mixer.motorMixer) {
            if (mixer.motorMixer.hasOwnProperty(i)) {
                const r = mixer.motorMixer[i];
                MOTOR_RULES.put(
                    new MotorMixRule(
                        r.getThrottle(),
                        r.getRoll(),
                        r.getPitch(),
                        r.getYaw()
                    )
                );
            }
        }
    }

    return publicScope;
})(mixerList);

// helper.platform = (function (platforms) {
//     let publicScope = {},
//         privateScope = {};

//     publicScope.getList = function () {
//         let retVal = [];
//         for (const i in platforms) {
//             if (platforms.hasOwnProperty(i)) {
//                 let element = platforms[i];
//                 if (element.enabled) {
//                     retVal.push(element);
//                 }
//             }
//         }
//         return retVal;
//     };

//     publicScope.getById = function (id) {
//         for (const i in platforms) {
//             if (platforms.hasOwnProperty(i)) {
//                 let element = platforms[i];
//                 if (element.id === id) {
//                     return element;
//                 }
//             }
//         }
//         return false;
//     }

//     return publicScope;
// })(platformList);
