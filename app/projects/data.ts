export interface Project {
  id: string;
  title: string;
  category: "iot" | "robotics" | "pcb" | "integrated";
  description: string;
  details: string;
  tech: string[];
  features: string[];
  status: "Completed" | "Open Source" | "In Development" | "Prototype Development";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  images: string[];
  video: string;
  schematics: string;
  codeSnippet: string;
  bom: { item: string; qty: number; link?: string }[];
}

export const projectsData: Project[] = [
  {
    id: "quadruped-robot-dog",
    title: "Quadruped Robot Dog for Industrial Inspection",
    category: "robotics",
    description: "A four-legged robotic platform designed for industrial inspection, surveillance, and operation in challenging environments.",
    details: "The robot uses high torque servo motors, embedded controllers, cameras, and sensors to achieve autonomous movement. Designed for inspection applications in industries where human access is difficult or unsafe.",
    tech: ["Raspberry Pi", "ESP32", "High Torque Servo Motors", "Camera Module", "IMU Sensor", "3D Printed Parts"],
    features: [
      "Four-legged robotic locomotion",
      "Industrial inspection capability",
      "Camera-based monitoring",
      "Modular mechanical design"
    ],
    status: "Prototype Development",
    difficulty: "Advanced",
    images: [
      "/images/robodog/Robodog_IMG.jpg",
      "/images/robodog/Robodog_IMG-2.jpg",
      "/images/robodog/Robodog_IMG-3.jpg",
      "/images/robodog/Robodog_IMG-4.jpg",
      "/images/robodog/Robodog_IMG-5.jpg",

    ],
    video: "https://assets.mixkit.co/videos/preview/mixkit-circuit-board-of-a-computer-close-up-23114-large.mp4",
    schematics: "Robot architecture consists of servo motor controllers connected with ESP32 for motion control. Raspberry Pi handles high-level processing, camera input, and AI-based inspection tasks.",
    codeSnippet: `// Servo control example
                    #include <Servo.h>

                    Servo legServo;

                    void setup() {
                      legServo.attach(18);
                    }

                    void loop() {
                      legServo.write(90);
                      delay(1000);
                    }`,
    bom: [
      { item: "RDS3225 High Torque Servo Motor", qty: 12 },
      { item: "Raspberry Pi Controller", qty: 1 },
      { item: "ESP32 Development Board", qty: 1 },
      { item: "Camera Module", qty: 1 },
      { item: "Li-ion Battery Pack", qty: 1 },
      { item: "3D Printed Mechanical Parts", qty: 1 }
    ]
  },
  {
    id: "electric-cycle",
    title: "Solar Assisted Smart Electric Cycle with Battery Management System",
    category: "integrated",
    description: "A solar-assisted electric bicycle integrating BLDC motor drive, lithium battery management, and renewable energy charging technology for sustainable mobility.",
    details: "A custom-built smart electric cycle combining BLDC motor propulsion, lithium-ion battery storage, solar charging system, and intelligent Battery Management System (BMS). The solar panel assists battery charging while the BMS provides protection against overcharging, over-discharging, and short circuits, improving battery safety and operational efficiency.",
    tech: [
      "BLDC Hub Motor",
      "Lithium-ion Battery Pack",
      "Solar Charging System",
      "BMS Protection Circuit",
      "Motor Controller",
      "ESP32/Arduino Monitoring",
      "Charge Controller"
    ],
    features: [
      "Solar assisted battery charging",
      "BLDC electric propulsion",
      "Smart battery protection using BMS",
      "Energy efficient transportation",
      "Real-time power monitoring",
      "Custom mechanical integration"
    ],
    status: "Completed",
    difficulty: "Advanced",
    images: [
      "/images/e-cycle/img_2.jpg",
      "/images/e-cycle/img_1.jpg",
      "/images/e-cycle/img_3.jpg",
    ],
    video: "https://assets.mixkit.co/videos/preview/mixkit-hardware-of-a-robot-close-up-4977-large.mp4",
    schematics: "Steppers driven via A4988 drivers connected to digital outputs pins D22-D37 of the Arduino Mega. Microstepping jumpers configured to 1/16 step mode for smooth vibration-free movement. Servos attached to PWM pins D2-D7.",
    codeSnippet: `
// Battery Monitoring Example

#define BATTERY_SENSOR A0

void setup(){
 Serial.begin(9600);
}

void loop(){
 int voltage = analogRead(BATTERY_SENSOR);
 Serial.println(voltage);

 delay(1000);
}`,
    bom: [
      { item: "BLDC Hub Motor", qty: 1 },
      { item: "Lithium Ion Battery Pack", qty: 1 },
      { item: "Battery Management System (BMS)", qty: 1 },
      { item: "BLDC Motor Controller", qty: 1 },
      { item: "Throttle Module", qty: 1 },
      { item: "Cycle Frame & Mechanical Assembly", qty: 1 }
    ]
  },
  {
    id: "remote-control-skateboard",
    title: "Remote Controlled Electric Skateboard",
    category: "robotics",
    description: "A wireless controlled electric skateboard platform using motor drive electronics and custom mechanical integration.",
    details: "Developed an electric skateboard system using high torque motors, motor controllers, lithium battery power system, and wireless remote communication. The platform enables smooth acceleration, speed control, and compact personal mobility.",
    tech: [
      "BLDC Motor",
      "Motor ESC",
      "RF Remote Control",
      "Lithium Battery",
      "Embedded Controller",
      "3D Printed Parts"
    ],
    features: [
      "Wireless speed control",
      "Electric propulsion system",
      "Compact mobility design",
      "Custom battery enclosure",
      "Variable speed control"
    ],
    status: "Completed",
    difficulty: "Intermediate",
    images: [
      "/images/eletric-skateboard/img_1.jpg",
      "/images/eletric-skateboard/img_2.jpg",
      "/images/eletric-skateboard/img_3.jpg",
      "/images/eletric-skateboard/img_4.jpg",
    ],
    video: "",
    schematics: "Wireless remote communicates with receiver module which controls motor driver signals. Battery power is regulated through ESC for efficient BLDC motor operation.",
    codeSnippet: `
// Motor Speed Control

int motorPWM = 9;

void setup(){
 pinMode(motorPWM, OUTPUT);
}

void loop(){

 analogWrite(motorPWM,180);

 delay(100);
}
`,
    bom: [
      { item: "BLDC Motor", qty: 1 },
      { item: "Electronic Speed Controller (ESC)", qty: 1 },
      { item: "Wireless Remote Controller", qty: 1 },
      { item: "Lithium Battery Pack", qty: 1 },
      { item: "Motor Mount Assembly", qty: 1 },
      { item: "Skateboard Deck", qty: 1 }
    ]
  },
  {
    id: "smart-conveyor-system",
    title: "Smart Conveyor Belt System with Battery Management",
    category: "integrated",
    description: "An automated conveyor platform integrating motor control, sensing, and intelligent power management.",
    details: "A custom conveyor automation system designed for material movement and industrial applications. The system combines DC motor control, object detection sensors, control electronics, and battery management for reliable industrial operation.",
    tech: [
      "Arduino",
      "DC Gear Motor",
      "Motor Driver",
      "IR Sensors",
      "BMS",
      "Lithium Battery System"
    ],
    features: [
      "Automatic object detection",
      "Controlled material movement",
      "Battery powered operation",
      "Industrial automation concept",
      "Expandable sensor integration"
    ],
    status: "Completed",
    difficulty: "Intermediate",
    images: [
      "/images/conveyer_belt/img-1.jpg",
      "/images/conveyer_belt/img-2.jpg",
      "/images/conveyer_belt/img-3.jpg",
    ],
    video: "",
    schematics: "Microcontroller processes sensor inputs and controls conveyor motor through motor driver circuitry. Battery system uses BMS protection for safe operation and charging.",
    codeSnippet: `
#define MOTOR_PIN 5
#define SENSOR_PIN 7

void setup(){
 pinMode(MOTOR_PIN,OUTPUT);
 pinMode(SENSOR_PIN,INPUT);
}

void loop(){

 if(digitalRead(SENSOR_PIN)){
   digitalWrite(MOTOR_PIN,HIGH);
 }
 else{
   digitalWrite(MOTOR_PIN,LOW);
 }

}
`,
    bom: [
      { item: "Arduino Controller", qty: 1 },
      { item: "DC Gear Motor", qty: 1 },
      { item: "Motor Driver Module", qty: 1 },
      { item: "IR Object Detection Sensor", qty: 2 },
      { item: "Lithium Battery Pack", qty: 1 },
      { item: "Battery Management System (BMS)", qty: 1 },
      { item: "Conveyor Belt Assembly", qty: 1 }
    ]
  },
  {
    id: "smart-soldering-iron",
    title: "Portable Smart Soldering Controller",
    category: "pcb",
    description: "A compact temperature-controlled soldering station motherboard compatible with T12 tips.",
    details: "Features fast heating, temperature calibration profiles, auto-sleep mode, and an intuitive UI on a 0.96-inch OLED screen. Housed in a flame-retardant ABS filament case.",
    tech: ["STM32", "OLED Display", "Custom Power Stage", "ABS-FR (Flame Retardant) Case"],
    features: ["8-second heat up", "Motion-detect sleep", "USB-C PD power", "Active thermal protections"],
    status: "In Development",
    difficulty: "Advanced",
    images: [
      "https://images.unsplash.com/photo-1517055729445-fa7d27394b48?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    ],
    video: "https://assets.mixkit.co/videos/preview/mixkit-circuit-board-of-a-computer-close-up-23114-large.mp4",
    schematics: "N-Channel MOSFET (AOD4184) driven by STM32 PWM to switch T12 heater core. Internal ADC measures voltage drop on thermocouple during PWM off cycle. PD Trigger Chip (IP2721) sets negotiation to 20V.",
    codeSnippet: `#define TEMP_PIN A0
#define HEATER_PWM_PIN 9
#define STANDBY_PIN 2

float Kp = 12.0, Ki = 0.5, Kd = 4.0;
float error, lastError, integral, derivative;
int setpoint = 320; // 320 deg C

void setup() {
  pinMode(HEATER_PWM_PIN, OUTPUT);
  pinMode(STANDBY_PIN, INPUT_PULLUP);
}

void loop() {
  int currentTemp = readThermocouple();
  if (digitalRead(STANDBY_PIN) == LOW) {
    setpoint = 150; // Sleep mode
  } else {
    setpoint = 320;
  }
  
  // PID math
  error = setpoint - currentTemp;
  integral += error;
  derivative = error - lastError;
  int output = Kp*error + Ki*integral + Kd*derivative;
  
  analogWrite(HEATER_PWM_PIN, constrain(output, 0, 255));
  lastError = error;
  delay(100);
}`,
    bom: [
      { item: "STM32F103C8T6 (Blue Pill)", qty: 1 },
      { item: "0.96 inch SSD1306 I2C OLED", qty: 1 },
      { item: "AOD4184 N-channel Power MOSFET", qty: 1 },
      { item: "LM358 Op-Amp (Thermocouple Amp)", qty: 1 },
      { item: "USB-C PD Decoy/Trigger board", qty: 1 },
      { item: "3D Printed ABS-FR Case", qty: 1 }
    ]
  },
  {
    id: "filament-dryer",
    title: "Smart Filament Dry-Box Controller",
    category: "integrated",
    description: "An automated enclosure heater and dehumidifier to keep 3D printing filament dry during printing.",
    details: "Measures real-time weight to compute remaining filament, controls a PTC heater block safely, and activates exhaust fan on high humidity levels.",
    tech: ["Arduino Nano", "Load Cell (HX711)", "PTC Heater", "PETG High-Temp Case", "OLED Screen"],
    features: ["Automated temperature regulation", "Spool weight estimator", "PTC safe thermal cutoff", "Humidity and Temp sensors"],
    status: "Completed",
    difficulty: "Intermediate",
    images: [
      "https://images.unsplash.com/photo-1615840287214-7fe58a8b668f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    video: "https://assets.mixkit.co/videos/preview/mixkit-circuit-board-of-a-computer-close-up-23114-large.mp4",
    schematics: "PTC 100W heater switched by 10A SPDT relay module on pin D4. HX711 Load Cell amplifier connected to pins D2 (DATA) and D3 (CLK). DHT22 temperature/humidity sensor on pin D5.",
    codeSnippet: `#include "HX711.h"
#include <DHT.h>

#define DOUT  2
#define CLK   3
#define RELAY_PIN 4

HX711 scale;
DHT dht(5, DHT22);

void setup() {
  scale.begin(DOUT, CLK);
  scale.set_scale(420.0); // Calibration factor
  scale.tare();
  dht.begin();
  pinMode(RELAY_PIN, OUTPUT);
}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  float weight = scale.get_units(5); // spool weight
  
  if (temp < 45.0 && hum > 25.0) {
    digitalWrite(RELAY_PIN, HIGH); // Turn heater ON
  } else if (temp > 50.0 || hum < 15.0) {
    digitalWrite(RELAY_PIN, LOW);  // Turn heater OFF
  }
  delay(2000);
}`,
    bom: [
      { item: "Arduino Nano board", qty: 1 },
      { item: "HX711 Weighing Sensor Module", qty: 1 },
      { item: "5kg Load Cell Bar", qty: 1 },
      { item: "100W 12V PTC Heating Element", qty: 1 },
      { item: "DHT22 Humidty/Temp sensor", qty: 1 },
      { item: "12V 10A Relay Module", qty: 1 },
      { item: "3D Printed Spool rollers and Enclosure (PETG)", qty: 1 }
    ]
  }
];
