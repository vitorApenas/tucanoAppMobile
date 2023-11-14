/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.tsx',
    './src/**/*.tsx'
  ],
  theme: {
    extend: {
      colors:{
        'back':'#ECF0F1',
        'standart':'#3A4365'
      },
      fontFamily:{
        nregular: 'Nunito_400Regular',
        nmedium: 'Nunito_500Medium',
        nsemibold: 'Nunito_600SemiBold',
        nbold: 'Nunito_700Bold',
        nextrabold: 'Nunito_800ExtraBold',
        nblack: 'Nunito_900Black'
      }
    },
  },
  plugins: [],
}