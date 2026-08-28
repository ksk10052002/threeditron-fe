export interface Project {
  id: string;
  title: string;
  category: "iot" | "robotics" | "pcb" | "integrated";
  description: string;
  details: string;
  tech: string[];
  features: string[];
  status: "Completed" | "Open Source" | "In Development";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  images: string[];
  video: string;
  schematics: string;
  codeSnippet: string;
  bom: { item: string; qty: number; link?: string }[];
}

export const projectsData: Project[] = [
  {
    id: "iot-weather-station",
    title: "IoT Environmental Weather Station",
    category: "iot",
    description: "An ESP32-based multi-sensor solar-powered weather monitor with custom 3D printed stevenson screen chassis.",
    details: "Integrates temperature, humidity, barometric pressure, and air quality sensors. Logs real-time data to a cloud dashboard via MQTT. Power-optimized using ESP32 deep-sleep modes to run indefinitely on solar power.",
    tech: ["ESP32", "BME280", "Solar Shield", "PLA+ Filament", "Adafruit IO"],
    features: ["Solar-charged battery power", "Waterproof 3D design", "Wi-Fi dashboard sync", "Deep sleep battery optimization"],
    status: "Open Source",
    difficulty: "Intermediate",
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1615840287214-7fe58a8b668f?auto=format&fit=crop&w=800&q=80"
    ],
    video: "https://assets.mixkit.co/videos/preview/mixkit-circuit-board-of-a-computer-close-up-23114-large.mp4",
    schematics: "ESP32 pins used: GPIO 21 (SDA), GPIO 22 (SCL) connected to BME280 sensor module. Battery voltage read through resistor divider on GPIO 34. Output regulated through AP2112 3.3V LDO for ultra-low quiescent current.",
    codeSnippet: `#include <WiFi.h>
#include <Wire.h>
#include <Adafruit_BME280.h>

#define uS_TO_S_FACTOR 1000000ULL  /* Conversion factor for micro seconds to seconds */
#define TIME_TO_SLEEP  900        /* Time ESP32 will go to sleep (in seconds) */

Adafruit_BME280 bme;

void setup() {
  Serial.begin(115200);
  if (!bme.begin(0x76)) {
    Serial.println("BME280 sensor error!");
    while (1);
  }
  
  // Read Data
  float temp = bme.readTemperature();
  float hum = bme.readHumidity();
  
  // Connect WiFi and send via MQTT...
  sendDataToCloud(temp, hum);
  
  // Go to sleep
  esp_sleep_enable_timer_wakeup(TIME_TO_SLEEP * uS_TO_S_FACTOR);
  esp_deep_sleep_start();
}`,
    bom: [
      { item: "ESP32 NodeMCU Module", qty: 1 },
      { item: "BME280 Sensor Breakout", qty: 1 },
      { item: "18650 Li-ion Battery & Holder", qty: 1 },
      { item: "5V 1W Solar Panel", qty: 1 },
      { item: "TP4056 Solar Charge Circuit", qty: 1 },
      { item: "3D Printed Stevenson Shield Case (PLA+)", qty: 1 }
    ]
  },
  {
    id: "robotic-arm",
    title: "6-Axis Robotic Arm Controller",
    category: "robotics",
    description: "A custom Arduino-based driver board and structural components for a high-precision tabletop robotic arm.",
    details: "Uses NEMA 17 stepper motors and servo drives with custom printed gears and joints. Controlled via USB or Bluetooth gamepad, utilizing inverse kinematics firmware computed on-board.",
    tech: ["Arduino Mega", "CNC Shield", "A4988 Drivers", "PETG Structural Print", "Bluetooth"],
    features: ["Inverse kinematics support", "Adjustable microstepping", "3D printed planetary gears", "Bluetooth remote control interface"],
    status: "Completed",
    difficulty: "Advanced",
    images: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
    ],
    video: "https://assets.mixkit.co/videos/preview/mixkit-hardware-of-a-robot-close-up-4977-large.mp4",
    schematics: "Steppers driven via A4988 drivers connected to digital outputs pins D22-D37 of the Arduino Mega. Microstepping jumpers configured to 1/16 step mode for smooth vibration-free movement. Servos attached to PWM pins D2-D7.",
    codeSnippet: `#include <AccelStepper.h>
#include <Servo.h>

// Define 6 Stepper Motors
AccelStepper axis1(AccelStepper::DRIVER, 22, 23);
AccelStepper axis2(AccelStepper::DRIVER, 24, 25);
AccelStepper axis3(AccelStepper::DRIVER, 26, 27);
AccelStepper axis4(AccelStepper::DRIVER, 28, 29);
AccelStepper axis5(AccelStepper::DRIVER, 30, 31);
AccelStepper axis6(AccelStepper::DRIVER, 32, 33);

void setup() {
  Serial.begin(9600);
  axis1.setMaxSpeed(1000.0);
  axis1.setAcceleration(500.0);
  // setup all other motors...
}

void loop() {
  if (Serial.available()) {
    // Read kinematics coordinates
    float x = Serial.parseFloat();
    float y = Serial.parseFloat();
    float z = Serial.parseFloat();
    calculateIK(x, y, z);
  }
  axis1.run();
  // run others...
}`,
    bom: [
      { item: "Arduino Mega 2560 board", qty: 1 },
      { item: "RAMPS 1.4 or CNC Shield", qty: 1 },
      { item: "A4988 Stepper Drivers", qty: 6 },
      { item: "NEMA 17 Stepper Motors", qty: 5 },
      { item: "MG996R Metal Gear Servo", qty: 1 },
      { item: "3D Printed Structural Joints (PETG)", qty: 1 }
    ]
  },
  {
    id: "smart-home-hub",
    title: "Custom Smart Home Gateway",
    category: "iot",
    description: "Raspberry Pi-powered Zigbee-to-WiFi gateway with a sleek wall-mountable matte black ABS case.",
    details: "Runs Home Assistant with custom dashboard to control all home appliances, smart lights, and security cameras locally. Bridges Zigbee sensors with home Wi-Fi network safely and securely.",
    tech: ["Raspberry Pi 4", "CC2531 Zigbee Dongle", "ABS Filament", "Home Assistant", "Custom PCB"],
    features: ["Local-first control", "Wall-mount snap design", "Status OLED display", "Secure local backups"],
    status: "Completed",
    difficulty: "Intermediate",
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    ],
    video: "https://assets.mixkit.co/videos/preview/mixkit-circuit-board-of-a-computer-close-up-23114-large.mp4",
    schematics: "OLED display (SSD1306) wired through hardware I2C interface on GPIO 2 (SDA) and GPIO 3 (SCL). Fan controller transistor switch connected to GPIO 14 (PWM) for thermal-controlled case cooling.",
    codeSnippet: `import time
import Adafruit_SSD1306
from PIL import Image, ImageDraw, ImageFont

# Initialize Raspberry Pi GPIO OLED
disp = Adafruit_SSD1306.SSD1306_128_64(rst=None)
disp.begin()
disp.clear()
disp.display()

# Draw system stats
width = disp.width
height = disp.height
image = Image.new('1', (width, height))
draw = ImageDraw.Draw(image)

while True:
    draw.rectangle((0,0,width,height), outline=0, fill=0)
    draw.text((0, 0), "THREEDITRON HUB", fill=255)
    draw.text((0, 16), "IP: 192.168.1.100", fill=255)
    draw.text((0, 32), "Zigbee: Connected", fill=255)
    disp.image(image)
    disp.display()
    time.sleep(5)`,
    bom: [
      { item: "Raspberry Pi 4 Model B (4GB)", qty: 1 },
      { item: "CC2531 USB Zigbee Sniffer", qty: 1 },
      { item: "0.96-inch OLED Screen (SSD1306)", qty: 1 },
      { item: "5V 3A Power Adapter", qty: 1 },
      { item: "3D Printed ABS Slim Enclosure", qty: 1 }
    ]
  },
  {
    id: "macro-keypad",
    title: "Threeditron Macro Keyboard (MacroPad)",
    category: "pcb",
    description: "A 12-key hot-swappable mechanical macro keypad featuring custom rotary encoders and RGB backlighting.",
    details: "Designed custom PCB layout in KiCad and printed the layered case using dual-color PLA. Runs on QMK/VIAL firmware for easy keymapping profiles.",
    tech: ["RP2040", "Cherry MX Switches", "Custom PCB", "Dual-color PLA", "QMK Firmware"],
    features: ["Layer switching", "Per-key RGB", "Dual metal rotary encoders", "Vial configurator support"],
    status: "Open Source",
    difficulty: "Beginner",
    images: [
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80"
    ],
    video: "https://assets.mixkit.co/videos/preview/mixkit-mechanical-keyboard-keys-pressed-33319-large.mp4",
    schematics: "RP2040 GPIO pins mapped directly to the 4x3 matrix. Diodes (1N4148) are placed in series with each key switch to prevent ghosting. WS2812B RGB LEDs are chained together on GPIO pin 23.",
    codeSnippet: `#pragma once
#define TAPPING_TERM 200

// Map key matrix pins
#define MATRIX_ROW_PINS { GP0, GP1, GP2 }
#define MATRIX_COL_PINS { GP3, GP4, GP5, GP6 }

// Rotary Encoders
#define ENCODERS_PAD_A { GP10, GP12 }
#define ENCODERS_PAD_B { GP11, GP13 }
#define ENCODER_RESOLUTION 4

// RGB Backlight
#define RGB_DI_PIN GP23
#define RGBLED_NUM 12`,
    bom: [
      { item: "RP2040 Zero or Pi Pico Board", qty: 1 },
      { item: "Cherry MX Mechanical Switches", qty: 12 },
      { item: "Hot-swap Switch Sockets", qty: 12 },
      { item: "WS2812B RGB LEDs", qty: 12 },
      { item: "EC11 Rotary Encoders", qty: 2 },
      { item: "1N4148 Switching Diodes", qty: 12 },
      { item: "3D Printed Case & Plate (PLA)", qty: 1 }
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
