<script lang="ts">
import { useAppStore } from '@/stores'

export default {
  onLaunch() {
    useAppStore().hydrateThemeMode()
    console.log('Truth app launched')
  },
  onShow() {
    useAppStore().hydrateThemeMode()
    console.log('Truth app shown')
  },
  onHide() {
    console.log('Truth app hidden')
  }
}
</script>

<style lang="scss">
@use '@/styles/runtime-theme.scss';
</style>
