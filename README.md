# What is it

A VR game with aeroplanes flying straight at you, and you have to shoot them down with the ice spears from your hand. You naturally throw these ice spears at the aeroplanes using a waving action from the Leap Motion, thus creating the first level of immersion. The second level of immersion comes from the vibration jacket that allows you to get a sense of "feeling" when you're "hit" by one of these aeroplanes. The final (and coolest, no pun intended) level of immersion comes from slowly feeling your hand turning cold from all the ice spears you're throwing (courtesy of a Peltier tile).

# How you can use it!

As of right now, the only version of the game has to be run in a WebVR friendly browser (we specifically used Mozilla Firefox) and you must have the following...
1. Oculus Rift
2. LeapMotion Camera

The following link shows how you can set up a LeapMotion camera with Oculus to play the game: https://www.youtube.com/watch?v=OUdL3y-mrFM

# How was it built

VR: Oculus Rift 
Hand Tracking: LeapMotion 
3D: A-frame, THREE.js 
Models: TinkerCAD 
Device: Arduino 101, Peltier tile 
Everything else: Javascript, html, node.js

# Challenges we ran into

Challenges started from having no idea what to build to showcase our vision, to having executional difficulties once we settled on an idea and having logistical issues (we bought the wrong cables once) while getting the project setup. Specifically, not having enough HDMI ports for the GPU we were using (since all the alienwares were checked out); postponed our work for several hours. Mixing ALL of the libraries we incorporated with A-frame took a lot of experimentation and tinkering before we had a working product, as one step in one aspect of the project set us two steps back in another. For example everytime we tried to incorporate a mesh/texture into our world, our projectiles stopped firing properly. It was also hard to think of a cool experience that justified the need for a cold glove experience. Getting collisions between planes and icicles to work properly was also challenging.

# Accomplishments that we're proud of

Getting the whole thing setup with all the hardware components, communicating across different languages, platforms and devices. We were also pleasantly surprised that we were able to figure out how to display the skeleton frame of the user’s hands via the LeapMotion api and also being able to smoothly integrate all the sensors into that.

# What we learned

There is a lot of potential for new VR hardware. Since the beginning of the hackathon, we were set on incorporating either heat or other senses into VR, and we learnt how to take that idea we had and make it into something tangible. Only one member of the team had worked with Web VR before, and the rest of us had to start from scratch, with two members of the team even having to learn javascript before starting out.

# What's next for Ice 'em

We would like to explore the hardware side of VR and how we can create wearable accessories that can make a user’s experience more immersive using impulses/weight simulation.

# We will update this file to show all hardware/gameplay aspects of the project!
