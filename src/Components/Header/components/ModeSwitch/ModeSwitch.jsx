import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'

function ModeSwitcher() {
  const { mode, setMode } = useColorScheme()

  if (!mode) {
    return null
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small-label">Mode</InputLabel>
      <Select
        style={{ display: 'flex' }}
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={mode}
        label="Mode"
        onChange={(e) => setMode(e.target.value)}
      >
        <MenuItem value={'light'}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent:'center' }}>Light <LightModeIcon sx={{ marginLeft:2 }}/></div>
        </MenuItem>
        <MenuItem value={'dark'}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent:'center' }}>Dark <DarkModeIcon sx={{ marginLeft:2 }}/></div>
        </MenuItem>
        <MenuItem value={'system'}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent:'center' }}>System <SettingsBrightnessIcon sx={{ marginLeft:2 }}/></div>
        </MenuItem>
      </Select>
    </FormControl>
  )
}

export default ModeSwitcher
