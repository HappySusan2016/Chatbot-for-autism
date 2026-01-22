
import { Story } from './types';

// Reliable "Toy/Soft/Cartoon-like" assets for Covers
export const IMAGES = {
  landing: "https://images.unsplash.com/photo-1555596873-45521b446f2f?auto=format&fit=crop&w=800&q=80", 
  birthday_cover: "https://images.unsplash.com/photo-1464349153912-bc73293d605b?auto=format&fit=crop&w=800&q=80",
  dentist_cover: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
  park_cover: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80",
  
  // Training
  training_parent: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80", 
  training_passport: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600' style='background-color:%23f1f5f9'%3E%3Crect x='150' y='125' width='500' height='350' rx='25' fill='white' style='filter:drop-shadow(0 10px 20px rgba(0,0,0,0.1))'/%3E%3Cpath d='M150 150 A25 25 0 0 1 175 125 L625 125 A25 25 0 0 1 650 150 L650 275 L150 275 Z' fill='%236366f1'/%3E%3Ccircle cx='260' cy='275' r='65' fill='white'/%3E%3Ccircle cx='260' cy='275' r='55' fill='%23e0e7ff'/%3E%3Ctext x='260' y='295' font-family='sans-serif' font-size='60' text-anchor='middle'%3E%F0%9F%90%BB%3C/text%3E%3Ctext x='350' y='200' font-family='sans-serif' font-size='32' fill='white' font-weight='bold'%3EAlex%3C/text%3E%3Crect x='350' y='220' width='200' height='12' rx='6' fill='%23a5b4fc'/%3E%3Crect x='350' y='245' width='150' height='12' rx='6' fill='%23a5b4fc'/%3E%3Cg transform='translate(200, 350)'%3E%3Crect width='180' height='80' rx='10' fill='%23f8fafc'/%3E%3Crect x='15' y='15' width='50' height='50' rx='10' fill='%23fecaca'/%3E%3Crect x='80' y='25' width='80' height='10' rx='5' fill='%23cbd5e1'/%3E%3Crect x='80' y='45' width='60' height='10' rx='5' fill='%23e2e8f0'/%3E%3C/g%3E%3Cg transform='translate(420, 350)'%3E%3Crect width='180' height='80' rx='10' fill='%23f8fafc'/%3E%3Crect x='15' y='15' width='50' height='50' rx='10' fill='%23fde68a'/%3E%3Crect x='80' y='25' width='80' height='10' rx='5' fill='%23cbd5e1'/%3E%3Crect x='80' y='45' width='60' height='10' rx='5' fill='%23e2e8f0'/%3E%3C/g%3E%3C/svg%3E",
  training_highfive: "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=800&q=80",
};

export const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1558060370-d644479cb673?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1555596873-45521b446f2f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1515488042361-25f4682f2c33?auto=format&fit=crop&w=800&q=80"
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
            imgUrl: "https://images.unsplash.com/photo-1530103043960-ef38714abb15?auto=format&fit=crop&w=800&q=80",
            visualPrompt: "A cute soft vector illustration of a happy teddy bear holding a colorful balloon at a party.",
            parentTip: "Smile and use an excited, soft voice.", 
            parentAction: "Ask: 'What colors do you see?'" 
          },
          { 
            type: 'sensory', 
            text: "Listen... friends are singing 'Happy Birthday'. It's a happy song. If it feels loud, we can hug our favorite toy.", 
            imgUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
            visualPrompt: "A cute vector illustration of animal friends singing together gently.",
            parentTip: "Validate feelings if they cover their ears.", 
            parentAction: "Practice: 'If it's loud, I can {strategy}.'" 
          },
          { 
            type: 'interaction', 
            text: "Look! A big, yummy cake with candles. {name} wants a slice, but we wait for just a tiny moment.", 
            imgUrl: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=800&q=80",
            visualPrompt: "A delicious colorful birthday cake vector illustration.",
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
            imgUrl: "https://images.unsplash.com/photo-1514525253361-bee8718a300c?auto=format&fit=crop&w=800&q=80",
            visualPrompt: "A happy character celebrating with soft confetti.",
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
            imgUrl: "https://images.unsplash.com/photo-1468493858157-0da44aaf1d13?auto=format&fit=crop&w=800&q=80",
            visualPrompt: "A cute cartoon friendly dentist office building.",
            parentTip: "Frame this as a 'Health Adventure'.", 
            parentAction: "Ask: 'Show me your big tiger teeth!'" 
          },
          { 
            type: 'sensory', 
            text: "The dentist has a special comfy chair. It goes up and down, like a gentle spaceship ride. Wheee!", 
            imgUrl: "https://images.unsplash.com/photo-1593022356769-11f09a79a5cc?auto=format&fit=crop&w=800&q=80",
            visualPrompt: "A cute comfy dentist chair illustration.",
            parentTip: "The movement can be surprising.", 
            parentAction: "Action: Pretend to lean back slowly." 
          },
          { 
            type: 'interaction', 
            text: "The light helps the dentist see better. We can open wide like a friendly {interest}!", 
            imgUrl: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=800&q=80",
            visualPrompt: "A friendly dentist character holding a toothbrush smiling.",
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
            imgUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80",
            visualPrompt: "A happy tooth character sparkling clean.",
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
            imgUrl: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80",
            visualPrompt: "A beautiful sunny park playground illustration.",
            parentTip: "Set expectations early.", 
            parentAction: "Ask: 'What do we do first?'" 
          },
          { 
            type: 'conflict', 
            text: "Oh look! A friend is already on the slide. That's okay. {name} can wait for a tiny moment.", 
            imgUrl: "https://images.unsplash.com/photo-1541913080211-4838a1acc508?auto=format&fit=crop&w=800&q=80",
            visualPrompt: "A cute character waiting at the bottom of a slide.",
            parentTip: "Validate frustration.", 
            parentAction: "Practice: Count to 5 together." 
          },
          { 
            type: 'interaction', 
            text: "{name} wants to go down the slide. We can use our soft words to ask.", 
            imgUrl: "https://images.unsplash.com/photo-1472162048230-5b62a79b883c?auto=format&fit=crop&w=800&q=80",
            visualPrompt: "Two cute characters talking nicely near a slide.",
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
            imgUrl: "https://images.unsplash.com/photo-1520202296606-ec46797abc12?auto=format&fit=crop&w=800&q=80",
            visualPrompt: "A happy character sliding down a slide laughing.",
            parentTip: "Celebrate the success of waiting.", 
            parentAction: "Cheer: 'You waited so well!'" 
          }
      ]
  }
};
