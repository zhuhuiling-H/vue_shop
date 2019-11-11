import Vue from 'vue'
import {
    Button,
    Form,
    FormItem,
    Input,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
    Cascader,
    Alert,
    Tabs,
    TabPane
} from 'element-ui'

Vue
    .use(Button)
    .use(Form)
    .use(FormItem)
    .use(Container)
    .use(Header)
    .use(Aside)
    .use(Main)
    .use(Input)
    .use(Menu)
    .use(Submenu)
    .use(MenuItem)
    .use(Breadcrumb)
    .use(BreadcrumbItem)
    .use(Card)
    .use(Row)
    .use(Col)
    .use(Table)
    .use(TableColumn)
    .use(Switch)
    .use(Pagination)
    .use(Dialog)
    .use(Tag)
    .use(Tree)
    .use(Select)
    .use(Option)
    .use(Cascader)
    .use(Alert)
    .use(Tabs)
    .use(TabPane)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm