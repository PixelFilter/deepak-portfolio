// Portfolio Data Configuration

const portfolioData = {
    personal: {
        name: "DEEPAK CHENNAKKADAN",
        resumeFile: "https://drive.google.com/file/d/1mEzfjeDsK1AXmpjJhJ7EOcCXMU4irOVZ/view?usp=drive_link"
    },
    connect: {
        name: "Deepak Chennakkadan",
        role: "Creative Technologist",
        photo: "assets/images/face_highres.png",
        social: {
            linkedin: "https://linkedin.com/in/deepakchennakkadan",
            instagram: "https://instagram.com/pixelfilter",
            email: "deepak.chennakkadan@gmail.com"
        }
    },
    about: {
        name: "Deepak Chennakkadan",
        role: "Creative Technologist",
        photo: "assets/images/face_highres.png",
        bio: [
            "Deepak Chennakkadan is a creative technologist and engineering leader with a passion for building tools that empower developers, artists, and content creators. With over 7 years at Microsoft as the ForzaTech Engineering Lead at Turn 10 Studios, he shaped AI workflows, scaled infrastructure, and led the development of several end-to-end pipelines for one of Xbox's flagship franchises.",
            "He has managed high-performing teams of engineers, interns, and vendors across disciplines, and has driven partnerships across Xbox Game Studios to foster alignment and technology sharing. In addition to his engineering leadership, Deepak has served as a public-facing voice for Xbox—appearing in media, interviews, and live streams, and speaking at industry conferences and summits.",
            "Outside of work, Deepak enjoys scuba diving, snowboarding, biking, and producing music."
        ]
    },
    navigation: [
        {id:"about", label: "ABOUT", url: "#about"},
        { id: "resume", label: "RESUME", url: "https://drive.google.com/file/d/1mEzfjeDsK1AXmpjJhJ7EOcCXMU4irOVZ/view?usp=drive_link" },
        { id: "connect", label: "CONNECT", url: "#" }
    ],
    filters: [
        { id: "games", label: "Games", active: true },
        { id: "apps", label: "Apps", active: false },
        { id: "music", label: "Music", active: false },
        { id: "press", label: "Press", active: false }
    ],
    categories: {
        games: {
            timeline: [
                {
                    year: 2024,
                    content: [
                        {
                            title: "Forza\nMotorsport",
                            slug: "forza-motorsport",
                            description: "A ground-up reboot of Forza focused on realism, tire physics, and immersive racing experiences.",
                            company: "Turn 10 Studios, Microsoft",
                            role: "ForzaTech Engineering Lead",
                            trailerUrl: "https://www.youtube.com/embed/aL4h5cMONIs",
                            videoStart: 8,
                            videoEnd: 60,
                            zoomVideo: true,
                            mobileVideoAlign: "center",
                            alignmentOffset: "0",                            
                            buttonLabel: "View Contributions",
                            infoPanelHeader: "Project Contributions",
                            infoPanelData: [
                                "Led the vision for AI workflows at Turn 10",
                                "Drove AI tech partnerships across Xbox Game Studios",
                                "Built AI-led localization test pipeline saving ~90% cost/time",
                                "Developed end-to-end UI content authoring pipeline",
                                "Created a variety of accessibility authoring tools",
                                "Owned strategy for test infrastructure scalability",
                                "Designed internal copilot tool that leveraged LLMs",
                                "Implemented editor features and led QoL efforts",
                                "Managed FTEs, vendors and interns across different teams",
                                "Presented talks at industry summits and conferences",
                                "Represented Xbox in media, interviews and live streams"
                            ]
                        }
                    ]
                },
                {
                    year: 2021,
                    content: [
                        {
                            title: "Forza\nHorizon 5",
                            slug: "forza-horizon-5",
                            description: "An open-world racer set in Mexico, blending exploration, arcade racing, and seasonal events.",
                            company: "Turn 10 Studios, Microsoft",
                            role: "Content Workflow Lead",
                            trailerUrl: "https://www.youtube.com/embed/FYH9n37B7Yw",
                            videoStart: 52,
                            videoEnd: 100,
                            zoomVideo: true,
                            mobileVideoAlign: "center",
                            alignmentOffset: "0",
                            buttonLabel: "View Contributions",
                            infoPanelHeader: "Project Contributions",
                            infoPanelData: [
                                "Led tech sharing initiatives between Turn 10 and Playground Games",
                                "Collaborated closely with Playground Games to solve problems for UI workflows",
                                "Worked on substance painter integration for ForzaTech",
                                "Built several editor features for the procedural generation systems",
                                "Oversaw several projects to port tools and editor features from Playground Games",
                            ]
                        }
                    ]
                },
                {
                    year: 2017,
                    content: [
                        {
                            title: "Forza\nMotorsport 7",
                            slug: "forza-motorsport-7",
                            description: "A simulation racing game with 700+ cars, dynamic weather, and competitive motorsport gameplay.",
                            company: "Turn 10 Studios, Microsoft",
                            role: "Software Engineer",
                            trailerUrl: "https://www.youtube.com/embed/9aAr5blVy0g",
                            videoStart: 17,
                            videoEnd: 85,
                            zoomVideo: true,
                            mobileVideoAlign: "center",
                            alignmentOffset: "0",
                            buttonLabel: "View Contributions",
                            infoPanelHeader: "Project Contributions",
                            infoPanelData: [
                                "Built tools and a variety of editor features",
                                "Fixed a lot of production blocking bugs for Motorsport Live",
                                "Managed UserVoice forums and internal feedback",
                                "Maintained automated ticket creation system for UserVoice items",
                                "Built a playlist management tool for the audio team",
                                "Worked on the shader node graph system in our editor",
                                "Helped with the weekly racing sled challenge",
                                "Playtested the game for every content update"
                            ]
                        }
                    ]
                },
                {
                    year: 2016,
                    content: [
                        {
                            title: "Magnolia",
                            slug: "magnolia",
                            description: "A poetic experience dedicated to the memory of a 3 year old girl where you play as her experiencing things she loved in real life.",
                            company: "Irradiance Games",
                            role: "Creative Director | Audio Programmer",
                            trailerUrl: "https://www.youtube.com/embed/yc1tn3Z5HvY",
                            videoStart: 12,
                            videoEnd: 75,
                            zoomVideo: false,
                            mobileVideoAlign: "center",
                            alignmentOffset: "0",
                            buttonLabel: "View Contributions",
                            infoPanelHeader: "Project Contributions",
                            infoPanelData: [
                                "Directed the team and held the overall vision for the game",
                                "Built the audio engine using the Wwise API",
                                "Bound the audio engine to LUA scripting",
                                "Integrated framework for the Emotiv Neuroheadset SDK",
                                "Worked intensively on the Wwise project",
                                "Implemented 3D positional audio in the engine along with cone filtering",
                                "Added the ability to change the radius of attenuation for the 3D audio objects",
                                "Implemented visual debug for all 3D audio objects in the editor",
                                "Implemented the ability to add multiple listeners and change the listener scale factor",
                                "Implemented footstep zones in the editor to define surface on which the player walks",
                                "Developed a footstep emitter and footstep animation syncing system",
                                "Implemented reverb zone system in the editor to define reverb zones",
                                "Implemented audio metering with the ability to select metering types (RMS, True Peak etc)",
                                "Scripted all the audio events in the game",
                                "Recorded, edited and implemented all the dialogue in the game",
                                "Designed a variety of sound effects",
                                "Mixed the final audio for the game",
                                "Helped design all the levels in the game",
                                "Developed the team website and created all promotional materials for the team",
                                "Playtested with testers and captured player feedback and sentiment"
                            ]
                        },
                        {
                            title: "Cubicopolis",
                            slug: "cubicopolis",
                            description: "A puzzle platformer where you solve puzzles by manipulating the camera to reveal unique perspectives.",
                            company: "Voxel Game Studios",
                            role: "Audio Programmer | Audio Content",
                            trailerUrl: "https://www.youtube.com/embed/CUZN1jfuZuw",
                            videoStart: 12,
                            videoEnd: 59,
                            zoomVideo: false,
                            mobileVideoAlign: "center",
                            alignmentOffset: "0",
                            buttonLabel: "View Contributions",
                            infoPanelHeader: "Project Contributions",
                            infoPanelData: [
                                "Built/Scripted the Audio Manager to manage all audio in the game in Unity",
                                "Composed, Recorded, Mixed and Mastered all music and audio content",
                                "Composed music in a style to change tempo as the game sped up",
                                "Designed the website",
                                "Designed all promotional materials",
                                "Conducted playtesting on a large scale",
                                "Utilized data tracking / analytics tools to keep track of a variety of game data",
                                "Handled marketing aspects such as social media etc"
                            ]
                        },
                        {
                            title: "Just Flick",
                            slug: "just-flick",
                            description: "An endless shape mathching and music synced iOS/Android mobile game.",
                            company: "Voxel Game Studios",
                            role: "Audio Programmer | Audio Content",
                            trailerUrl: "https://www.youtube.com/embed/jKOilVDdx9o",
                            videoStart: 5,
                            videoEnd: 20,
                            zoomVideo: false,
                            mobileVideoAlign: "right",
                            alignmentOffset: "-28",
                            buttonLabel: "View Contributions",
                            infoPanelHeader: "Project Contributions",
                            infoPanelData: [
                                "Handled logistics of beta release for Google Play Store launch",
                                "Integrated Audiokinetic's Wwise into Unity 5",
                                "Composed, recorded, mixed and mastered all the music for the game",
                                "Custom crafted all the sound effects utilized in the game",
                                "Implemented a dynamic music system that adapts to the level",
                                "Implemented velocity driven audio feedback for movement",
                                "Designed and assisted in designing several levels",
                                "Performed intensive tests on a variety of Android devices",
                                "Playtested with testers and captured player feedback and sentiment",
                                "Developed the website and created all promotional materials for the game",
                                "Marketed the game on social media, game websites and forums"
                            ]
                        }
                    ]
                },
                {
                    year: 2015,
                    content: [
                        {
                            title: "Flickers",
                            slug: "flickers",
                            description: "An atmospheric platformer where you journey from a dying flower to the moon, jumping between sparks to transform a twilight world through emotion and rhythm.",
                            company: "Neat Snake",
                            role: "Mixing & Mastering Engineer",
                            trailerUrl: "https://www.youtube.com/embed/sFJyjHDlOuE",
                            videoStart: 21,
                            videoEnd: 37,
                            zoomVideo: false,
                            mobileVideoAlign: "center",
                            alignmentOffset: "0",
                            buttonLabel: "View Contributions",
                            infoPanelHeader: "Project Contributions",
                            infoPanelData: [
                                "Did a comprehensive mix for the entire OST",
                                "Handled MIDI replacements for many tracks",
                                "Did a final master on the bandcamp release album"
                            ]
                        },
                        {
                            title: "Never Alone",
                            slug: "never-alone",
                            description: "Never Alone: Foxtales is the first expansion to Never Alone, featuring Nuna and Fox in a new adventure.",
                            company: "Upper One Games",
                            role: "Game Tester",
                            trailerUrl: "https://www.youtube.com/embed/V9jT_PKGXdI",
                            videoStart: 24,
                            videoEnd: 65,
                            zoomVideo: false,
                            mobileVideoAlign: "center",
                            alignmentOffset: "0",
                            buttonLabel: "View Contributions",
                            infoPanelHeader: "Project Contributions",
                            infoPanelData: [
                                "Playtested the game and gave essential feedback",
                                "Sent detailed reports regarding bugs, glitches, crashes and frame rate drops"
                            ]
                        },
                        {
                            title: "Tread Lightly",
                            slug: "tread-lightly",
                            description: "A poetic experience of a mysterious character treading their way through a lifeless, ominous landscape.",
                            company: "Team Yarbus",
                            role: "Audio Programmer | Audio Content",
                            trailerUrl: "https://www.youtube.com/embed/5qvZPTqIPDs",
                            videoStart: 25,
                            videoEnd: 72,
                            zoomVideo: false,
                            mobileVideoAlign: "center",
                            alignmentOffset: "0",
                            buttonLabel: "View Contributions",
                            infoPanelHeader: "Project Contributions",
                            infoPanelData: [
                                "Built the audio engine wrapped around the Fmod Studio Low Level API",
                                "Implemented a DSP System with custom audio filters, parametric EQ and reverb",
                                "Implemented a microphone system with RMS peak, frequency and musical pitch detection",
                                "Implemented a system to procedurally generate wind like sound effects using white noise",
                                "Implemented the audio component for level editor",
                                "Composed, recorded, mixed and mastered all the music for the game",
                                "Custom crafted all the sound effects utilized in the game",
                                "Foley recorded atmospheric/ambient sounds",
                                "Developed the game website and created all promotional materials for the team",
                                "Helped with the design iteration process",
                                "Playtested with testers and captured player feedback and sentiment",
                                "Designed the color palette for the entire game",
                                "Edited all video content for the game launch"
                            ]
                        }
                    ]
                },
                {
                    year: 2014,
                    content: [
                        {
                            title: "Auricular Hierarchy",
                            slug: "auricular-hierarchy",
                            description: "A 2D sound-driven platformer where jumping creates music and color, transforming a minimalist world through exploration.",
                            company: "Sient Sound Productions",
                            role: "Audio Programmer | Audio Content",
                            trailerUrl: "https://www.youtube.com/embed/BX70y7mq4aA",
                            videoStart: 25,
                            videoEnd: 90,
                            zoomVideo: true,
                            mobileVideoAlign: "center",
                            alignmentOffset: "0",
                            buttonLabel: "View Contributions",
                            infoPanelHeader: "Project Contributions",
                            infoPanelData: [
                                "Built the audio engine wrapped around the Fmod Ex Low Level API",
                                "Composed, recorded, mixed and mastered all the music for the game",
                                "Custom crafted all the sound effects utilized in the game",
                                "Built particle system to generate colorful visuals",
                                "Implemented the error handling system",
                                "Helped with the design iteration process",
                                "Edited all video content for the team"
                            ]
                        }
                    ]
                },
                {
                    year: 2013,
                    content: [
                        {
                            title: "Discord",
                            slug: "discord-game",
                            description: "Discord is a 2D arcade game where you throw and catch a ball to break tiles, collect orbs, and score points before time runs out.",
                            company: "Team Discord",
                            role: "Audio Programmer | Audio Content",
                            trailerUrl: "https://www.youtube.com/embed/xIsTQIe18iQ",
                            videoStart: 10,
                            videoEnd: 70,
                            zoomVideo: false,
                            mobileVideoAlign: "center",
                            alignmentOffset: "0",
                            buttonLabel: "View Contributions",
                            infoPanelHeader: "Project Contributions",
                            infoPanelData: [
                                "Custom crafted all sound effects",
                                "Wrote high-energy electronic soundtrack",
                                "Conducted playtest sessions",
                                "Implemented all audio for the game"
                            ]
                        }
                    ]
                }
            ]
        },
        apps: {
            timeline: [
                {
                    year: 2020,
                    content: [                       
                        {
                            title: "Wish Drop",
                            slug: "wish-drop",
                            description: "Wish Drop was a social wish-list app that simplified the process of gifting and visiting bucket-list places.",
                            company: "Wish Drop LLC.",
                            role: "Chief Operating Officer",
                            trailerUrl: "https://www.youtube.com/embed/41JXyYjvnSI",
                            videoStart: 1,
                            videoEnd: 60,
                            zoomVideo: false,
                            mobileVideoAlign: "center",
                            alignmentOffset: "0",
                            projectImage: "assets/images/apps/wish_drop.png",
                            buttonLabel: "View Contributions",
                            infoPanelHeader: "Project Contributions",
                            infoPanelData: [
                                "Managed a team of developers for building the iOS, Android, Web apps",
                                "Managed the development of the admin and analytics panel",
                                "Coordinated with QA testers to ensure the app is stable",
                                "Came up with complete designs for the mobile version",
                                "Optimized UI development workflows",
                                "Developed the launch landing page",
                                "Spearheaded beta soft launch in two cities",
                                "Handled marketing aspects for all soft launches",
                            ]
                        }
                    ]
                },
                {
                    year: 2017,
                    content: [                       
                        {
                            title: "Spectral-EQ",
                            slug: "spectral-eq",
                            description: "A spectrum analyzer plugin with a 6 band parametric EQ and FFT-based visualizer developed for Logic Pro.",
                            company: "Passion Project",
                            role: "Sole Developer",
                            trailerUrl: "https://www.youtube.com/embed/yZD-i5p5UC0",
                            videoStart: 0,
                            videoEnd: 60,
                            zoomVideo: false,
                            mobileVideoAlign: "center",
                            alignmentOffset: "0",
                            projectImage: "assets/images/apps/spectral_eq.png",
                            buttonLabel: "Project Details",
                            infoPanelHeader: "Project Details",
                            infoPanelData: [
                                "Written in Objective-C and C++",
                                "Utilized Mac's Core Audio SDK to build this",
                                "All the UI code was built using Cocoa",
                                "Used fast fourier transforms to visualize the dry/wet audio spectrum",
                                "Implemented different FFT windowing functions",
                                "Implemented a 6 band parametric EQ with gain, frequency and Q factor",
                            ]
                        }
                    ]
                },                
                {
                    year: 2016,
                    content: [                       
                        {
                            title: "Pedal Stack",
                            slug: "pedal-stack",
                            description: "A guitar processor app with 5 usable guitar pedals: Delay, Distortion, Reverb, Whammy and Equalizer.",
                            company: "Passion Project",
                            role: "Sole Developer",
                            trailerUrl: "https://www.youtube.com/embed/1TjHu73UuJc",
                            videoStart: 0,
                            videoEnd: 60,
                            zoomVideo: false,
                            mobileVideoAlign: "center",
                            alignmentOffset: "0",
                            projectImage: "assets/images/apps/pedal_stack.png",
                            buttonLabel: "Project Details",
                            infoPanelHeader: "Project Details",
                            infoPanelData: [                                
                                "Written in Objective-C and C++",
                                "Utilized Mac's Core Audio SDK to build this",
                                "All the UI code was built using Cocoa",
                                "Implemented a full signal chain routing system like a guitar pedal board",
                                "Wrote all the DSP algorithms for the pedals"
                            ]
                        }
                    ]
                },                
                {
                    year: 2015,
                    content: [                      
                        {
                            title: "Eclipse Synth",
                            slug: "eclipse-synth",
                            description: "Eclipse Synth is a virtual synthesizer featuring dual oscillators, flexible envelope controls, three filter types.",
                            company: "Passion Project",
                            role: "Sole Developer",
                            trailerUrl: "https://www.youtube.com/embed/iMDL5so-MHw",
                            videoStart: 1,
                            videoEnd: 12,
                            zoomVideo: true,
                            mobileVideoAlign: "center",
                            alignmentOffset: "0",
                            projectImage: "assets/images/apps/eclipse_synth.png",
                            buttonLabel: "Project Details",
                            infoPanelHeader: "Project Details",
                            infoPanelData: [                                
                                "Written in C++ using WDL and IPlug SDK",
                                "Implemented complex routing system for the oscillators",
                                "Each oscillator has its own waveform and frequency controls",
                                "Added a variety of envelope controls",
                                "Designed three filter types: Low Pass, High Pass and Band Pass",
                                "Added support for MIDI input",
                            ]
                        },                       
                        {
                            title: "R2D2IZER",
                            slug: "r2d2izer",
                            description: "A fun little app named after the iconic robot from Star Wars which used audio processing techniques to create R2D2 like sound effects.",
                            company: "Passion Project",
                            role: "Sole Developer",
                            trailerUrl: "https://www.youtube.com/embed/geD8HxtQ_lY",
                            videoStart: 19,
                            videoEnd: 50,
                            zoomVideo: false,
                            mobileVideoAlign: "center",
                            alignmentOffset: "0",
                            projectImage: "assets/images/apps/R2D2IZER.png",
                            buttonLabel: "Project Details",
                            infoPanelHeader: "Project Details",
                            infoPanelData: [                
                                "Written in C++ using WDL and IPlug SDK",
                                "Initially built as a waveform generator",
                                "A bug caused it to sound like R2D2",
                                "Now, it's a feature :)"
                            ]
                        }
                    ]
                }
            ]
        },
        music: {
            timeline: [
                {
                    year: 2024,
                    content: [
                        {
                            title: "Hyperbolic\nChamber",
                            slug: "hyperbolic-chamber",
                            description: "Hyperbolic Chamber is a platform to showcase immersive, experimental electronic music from underground artists including us.",
                            company: "Passion Project",
                            role: "Co-Founder",
                            trailerUrl: "https://www.youtube.com/embed/sB-UvVvmUfk",
                            videoStart: 2738,
                            videoEnd: 2838,
                            zoomVideo: false,
                            mobileVideoAlign: "center",
                            alignmentOffset: "0",
                            buttonLabel: "View Platform",
                            buttonURL: "https://hyperbolic-chamber.space"
                        }
                    ]
                },
                {
                    year: 2023,
                    content: [                       
                        {
                            title: "PIXELFILTER",
                            slug: "pixelfilter",
                            description: "My electronic music alter ego / stage name where I perform and record live sets showcasing the underground sound.",
                            company: "Creative Pursuit",
                            role: "Techno / Indo DJ",
                            trailerUrl: "https://www.youtube.com/embed/bO_1bl7s9TQ",
                            videoStart: 972,
                            videoEnd: 1070,
                            zoomVideo: false,
                            mobileVideoAlign: "center",
                            alignmentOffset: "0",
                            buttonLabel: "View Videos",
                            buttonURL: "https://pixelfilter.space"
                        }
                    ]
                },
                {
                    year: 2012,
                    content: [                       
                        {
                            title: "Youtube\nGuitar Videos",
                            slug: "youtube-guitar-videos",
                            description: "A series of guitar videos I have recorded over the years showcasing one of my many musical passions.",
                            company: "Creative Pursuit",
                            role: "Guitarist",
                            trailerUrl: "https://www.youtube.com/embed/DpXcdQLeqbI",
                            videoStart: 180,
                            videoEnd: 230,
                            zoomVideo: false,
                            mobileVideoAlign: "center",
                            alignmentOffset: "0",
                            buttonLabel: "View Videos",
                            buttonURL: "https://www.youtube.com/@DeepakChennakkadan/videos"
                        }
                    ]
                }
            ]
        },
        press: {
            timeline: [
                {
                    year: 2024,
                    content: [
                        {
                            title: "Xbox Super\nGaming Update",
                            slug: "xbox-super-gaming-update",
                            description: "Hosted the Super Gaming Update with Phil Spencer (CEO, Microsoft Gaming), Cynthia Per-Lee (CVP, Gaming HR), Kevin Gammil (CVP, Ecosystem Engineering) at Xbox.",
                            company: "Xbox Studio",
                            role: "Host",
                            trailerUrl: "https://www.youtube.com/embed/akLUAwzVicg",
                            videoStart: 1,
                            videoEnd: 18,
                            zoomVideo: false,
                            mobileVideoAlign: "center"
                        }
                    ]
                },
                {
                    year: 2023,
                    content: [
                        {
                            title: "Diablo IV\nLaunch Event",
                            slug: "diablo-iv-launch-event",
                            description: "Co-Hosted the Diablo IV launch event with Rod Fergusson (Head of Diablo), Xbox's Major Nelson and Mav from TheMavShow.",
                            company: "Xbox Plays",
                            role: "Co-Host",
                            trailerUrl: "https://www.youtube.com/embed/K9SqwT2_1o4",
                            videoStart: 0,
                            videoEnd: 37,
                            zoomVideo: false,
                            mobileVideoAlign: "left",
                            alignmentOffset: "-60",
                            buttonLabel: "View Stream",
                            buttonURL: "https://www.twitch.tv/videos/1839380809?t=00h08m19s"
                        },
                        {
                            title: "Forza Motorsport\nLaunch Stream",
                            slug: "forza-motorsport-launch-stream",
                            description: "Co-Hosted the Forza Motorsport launch stream which was broadcasted on the front page of Twitch and the Steam Store.",
                            company: "Turn 10 Studios",
                            role: "Co-Host",
                            trailerUrl: "https://www.youtube.com/embed/lVMDtHM7wWE",
                            videoStart: 2,
                            videoEnd: 40,
                            zoomVideo: false,
                            mobileVideoAlign: "right",
                            alignmentOffset: "-30",
                            buttonLabel: "View Stream",
                            buttonURL: "https://www.twitch.tv/videos/1943634392?t=01h45m16s"
                        },
                        {
                            title: "Xbox ASL\nStream",
                            slug: "xbox-asl-stream",
                            description: "Hosted the Xbox ASL Anniversary Stream with an Xbox Sign Language Expert where we played Forza Horizon 5 and talked about accessibility in gaming.",
                            company: "Xbox Plays",
                            role: "Host",
                            trailerUrl: "https://www.youtube.com/embed/asSK3ijcz9I",
                            videoStart: 1,
                            videoEnd: 120,
                            zoomVideo: false,
                            mobileVideoAlign: "left",
                            alignmentOffset: "-80",
                            buttonLabel: "View Stream",
                            buttonURL: "https://www.twitch.tv/videos/1816452658?t=01h38m56s"
                        }
                    ]
                },
                {
                    year: 2017,
                    content: [
                        {
                            title: "Intel University\nGames Showcase",
                            slug: "intel-university-games-showcase",
                            description: "Presented our Student Game, Magnolia at the Intel University Showcase in San Francisco.",
                            company: "Irradiance Games",
                            role: "Presenter",
                            trailerUrl: "https://www.youtube.com/embed/BBkpIn4Ihkc",
                            videoStart: 21,
                            videoEnd: 70,
                            zoomVideo: false,
                            mobileVideoAlign: "center",
                            alignmentOffset: "0",
                            buttonLabel: "View Stream",
                            buttonURL: "https://youtu.be/BBkpIn4Ihkc?si=PxzuBAFJkIzu2aYn"
                        }
                    ]
                }
            ]
        }
    },
    
    // Helper method to set active filter
    setActiveFilter(filterId) {
        // Update the active filter in the data
        this.filters.forEach(filter => {
            filter.active = filter.id === filterId;
        });
    },
    
    // Helper method to get timeline data based on active filter
    getTimelineData() {
        const activeFilter = this.filters.find(f => f.active);
        
        if (!activeFilter) {
            // Default to games if no filter is active
            return this.categories.games?.timeline || [];
        }
        
        // Dynamically return the timeline for the active category
        return this.categories[activeFilter.id]?.timeline || [];
    },

    // Helper method to find a project by slug within a category
    findProjectBySlug(categoryId, slug) {
        const category = this.categories[categoryId];
        if (!category || !category.timeline) {
            return null;
        }

        for (const yearData of category.timeline) {
            for (const project of yearData.content) {
                if (project.slug === slug) {
                    return {
                        project,
                        year: yearData.year,
                        categoryId
                    };
                }
            }
        }
        return null;
    },

    // Helper method to find a project by slug across all categories
    findProjectBySlugGlobal(slug) {
        for (const categoryId of Object.keys(this.categories)) {
            const result = this.findProjectBySlug(categoryId, slug);
            if (result) {
                return result;
            }
        }
        return null;
    },

    // Helper method to get project index within timeline for navigation
    getProjectIndexInTimeline(categoryId, slug) {
        const category = this.categories[categoryId];
        if (!category || !category.timeline) {
            return -1;
        }

        let index = 0;
        for (const yearData of category.timeline) {
            for (const project of yearData.content) {
                if (project.slug === slug) {
                    return index;
                }
                index++;
            }
        }
        return -1;
    }
};

// Export for use in other modules
window.portfolioData = portfolioData;
