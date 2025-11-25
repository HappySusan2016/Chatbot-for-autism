

import { Story } from './types';

// Reliable "Toy/Soft/Cartoon-like" assets for Covers
// Using specific Unsplash IDs that feature toys, clay, or minimalist pastel art.
export const IMAGES = {
  // Landing: Cute knitted bear
  landing: "https://images.unsplash.com/photo-1555596873-45521b446f2f?auto=format&fit=crop&w=800&q=80", 
  
  // Covers - Soft, toy-like, pastel
  birthday_cover: "https://images.unsplash.com/photo-1464349153912-bc73293d605b?auto=format&fit=crop&w=800&q=80", // Toys/Party
  dentist_cover: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80", // Cute dental toy/concept
  park_cover: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80", // Colorful abstract playground
  
  // Training
  training_parent: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80", 
  training_passport: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
  training_highfive: "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=800&q=80",
};

// Fallback images (Cute/Soft/Cartoon-like) to use if AI generation fails (e.g. Quota Exceeded)
export const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1558060370-d644479cb673?auto=format&fit=crop&w=800&q=80", // Cute animal
  "https://images.unsplash.com/photo-1555596873-45521b446f2f?auto=format&fit=crop&w=800&q=80", // Knitted bear
  "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80", // Toys
  "https://images.unsplash.com/photo-1515488042361-25f4682f2c33?auto=format&fit=crop&w=800&q=80"  // Soft toy
];

export const STORIES: Record<string, Story> = {
  'birthday': {
      id: 'birthday',
      title: "The Birthday Party",
      topic: "the Birthday Party",
      description: "A gentle story about balloons, singing, and waiting for yummy cake.",
      coverImage: IMAGES.birthday_cover,
      tags: { icon: 'cake', label: 'Fun & Friends', color: 'text-indigo-600', bg: 'bg-indigo-50' },
      slides: [
          { 
            type: 'intro', 
            text: "Yay! Today {name} is going to a Birthday Party! Look at the colorful balloons floating so gently.", 
            imgUrl: "", // Empty to force AI generation
            visualPrompt: "A cute soft vector illustration of a happy teddy bear holding a colorful balloon at a party. Pastel colors.",
            parentTip: "Smile and use an excited, soft voice.", 
            parentAction: "Ask: 'What colors do you see?'" 
          },
          { 
            type: 'sensory', 
            text: "Listen... friends are singing 'Happy Birthday'. It's a happy song. If it feels loud, we can hug our favorite toy.", 
            imgUrl: "",
            visualPrompt: "A cute vector illustration of animal friends singing together gently. Soft style.",
            parentTip: "Validate feelings if they cover their ears.", 
            parentAction: "Practice: 'If it's loud, I can {strategy}.'" 
          },
          { 
            type: 'interaction', 
            text: "Look! A big, yummy cake with candles. {name} wants a slice, but we wait for just a tiny moment.", 
            imgUrl: "",
            visualPrompt: "A delicious colorful birthday cake vector illustration. Cute style.",
            parentTip: "Waiting is hard. Suggest a distractor.", 
            choices: [
              { text: "Wait nicely", feedback: "You are doing such a great job waiting!" }, 
              { text: "Take a breath", feedback: "Breathing helps us feel calm and ready for cake." },
              { text: "Ask nicely", feedback: "Good asking! The cake is coming very soon." }
            ], 
            parentAction: "" 
          },
          { 
            type: 'conclusion', 
            text: "The party was so much fun! {name} had a wonderful time and made everyone smile.", 
            imgUrl: "",
            visualPrompt: "A happy character celebrating with soft confetti. Pastel colors.",
            parentTip: "Praise specific efforts.", 
            parentAction: "High five or big hug!" 
          }
      ]
  },
  'dentist': {
      id: 'dentist',
      title: "My Dentist Adventure",
      topic: "the Dentist",
      description: "A cozy adventure to visit the tooth friend who helps us smile.",
      coverImage: IMAGES.dentist_cover,
      tags: { icon: 'medical_services', label: 'Health', color: 'text-teal-600', bg: 'bg-teal-50' },
      slides: [
          { 
            type: 'intro', 
            text: "{name} has a beautiful smile! Today we visit the Dentist. The Dentist is a kind helper who loves clean teeth.", 
            imgUrl: "",
            visualPrompt: "A cute cartoon friendly dentist office building. Soft colors.",
            parentTip: "Frame this as a 'Health Adventure'.", 
            parentAction: "Ask: 'Show me your big tiger teeth!'" 
          },
          { 
            type: 'sensory', 
            text: "The dentist has a special comfy chair. It goes up and down, like a gentle spaceship ride. Wheee!", 
            imgUrl: "",
            visualPrompt: "A cute comfy dentist chair illustration. Vector art.",
            parentTip: "The movement can be surprising.", 
            parentAction: "Action: Pretend to lean back slowly." 
          },
          { 
            type: 'interaction', 
            text: "The light helps the dentist see better. We can open wide like a friendly {interest}!", 
            imgUrl: "",
            visualPrompt: "A friendly dentist character holding a toothbrush smiling. Cute vector art.",
            parentTip: "Use the special interest.", 
            choices: [
              { text: "Open wide", feedback: "Roar! You opened wide like a dinosaur!" }, 
              { text: "Wear sunglasses", feedback: "Cool sunglasses help with the bright light." },
              { text: "Squeeze a toy", feedback: "Squeezing helps you feel brave and strong." }
            ], 
            parentAction: "" 
          },
          { 
            type: 'conclusion', 
            text: "All done! {name}'s teeth are super clean and shiny like stars. You were so brave today!", 
            imgUrl: "",
            visualPrompt: "A happy tooth character sparkling clean. Kawaii style.",
            parentTip: "Immediate reward helps memory.", 
            parentAction: "Say: 'I am so proud of you.'" 
          }
      ]
  },
  'park': {
      id: 'park',
      title: "Fun at the Park",
      topic: "Sharing",
      description: "A story about playing nicely and taking turns on the slide.",
      coverImage: IMAGES.park_cover,
      tags: { icon: 'groups', label: 'Social Skills', color: 'text-orange-600', bg: 'bg-orange-50' },
      slides: [
          { 
            type: 'intro', 
            text: "The sun is warm and lovely. {name} is ready to play on the big fun slide at the park!", 
            imgUrl: "",
            visualPrompt: "A beautiful sunny park playground illustration. Vector art.",
            parentTip: "Set expectations early.", 
            parentAction: "Ask: 'What do we do first?'" 
          },
          { 
            type: 'conflict', 
            text: "Oh look! A friend is already on the slide. That's okay. {name} can wait for a tiny moment.", 
            imgUrl: "",
            visualPrompt: "A cute character waiting at the bottom of a slide. Soft colors.",
            parentTip: "Validate frustration.", 
            parentAction: "Practice: Count to 5 together." 
          },
          { 
            type: 'interaction', 
            text: "{name} wants to go down the slide. We can use our soft words to ask.", 
            imgUrl: "",
            visualPrompt: "Two cute characters talking nicely near a slide. Friendship theme.",
            parentTip: "Model the social script.", 
            choices: [
              { text: "My turn please?", feedback: "Nice asking! Words are like magic." }, 
              { text: "Take a breath", feedback: "Calm body helps us play nicely." },
              { text: "Play nearby", feedback: "Good idea! We can play here while we wait." }
            ], 
            parentAction: "" 
          },
          { 
            type: 'conclusion', 
            text: "Yay! Now it is {name}'s turn! Whoosh! Sliding is fast and so much fun.", 
            imgUrl: "",
            visualPrompt: "A happy character sliding down a slide laughing. Vector art.",
            parentTip: "Celebrate the success of waiting.", 
            parentAction: "Cheer: 'You waited so well!'" 
          }
      ]
  }
};