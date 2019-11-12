import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import { CheckIcon } from '../../../icons/icon'
import appImage from '../../../assets/img/windows-app.jpeg'

export default function WindowsApp() {
  return (
    <List>
      <ListItem>
        <ListItemIcon>
        <CheckIcon />
        </ListItemIcon>
        <ListItemText primary="Facturación electrónica como para regimen simplificado" />
      </ListItem>
      <ListItem>
        <ListItemIcon>
        <CheckIcon />
        </ListItemIcon>
        <ListItemText primary="Ingreso de compras de mercadería" />
      </ListItem>
      <ListItem>
        <ListItemIcon>
        <CheckIcon />
        </ListItemIcon>
        <ListItemText primary="Control de inventario" />
      </ListItem>
      <ListItem>
        <ListItemIcon>
        <CheckIcon />
        </ListItemIcon>
        <ListItemText primary="Catálogo de sus clientes" />
      </ListItem>
      <ListItem>
        <ListItemIcon>
        <CheckIcon />
        </ListItemIcon>
        <ListItemText primary="Mantenimiento de categorías y productos" />
      </ListItem>
      <ListItem>
        <ListItemIcon>
        <CheckIcon />
        </ListItemIcon>
        <ListItemText primary="Gestión de sus cuentas por cobrar" />
      </ListItem>
      <ListItem>
        <ListItemIcon>
        <CheckIcon />
        </ListItemIcon>
        <ListItemText primary="Administración de sus cuentas por pagar" />
      </ListItem>
      <ListItem>
        <ListItemIcon>
        <CheckIcon />
        </ListItemIcon>
        <ListItemText primary="Gestión de sus cuentas por cobrar" />
      </ListItem>
    </List>
  )
}