import DefaultTheme from 'vitepress/theme'
import TourLink from './components/TourLink.vue'
import HomeFooter from './components/HomeFooter.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('tour-link', TourLink)
    app.component('home-footer', HomeFooter)
  }
}
