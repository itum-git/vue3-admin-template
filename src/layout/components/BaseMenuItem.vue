<script lang="tsx">
import type { RouteMeta } from 'vue-router'
import { propTypes } from '@/utils/propTypes'
import { hasOneShowingChild } from './helper'
import { isUrl } from '@/utils/is'
import { pathResolve } from '@/utils/routerHelper'
import { Icon } from '@/components/Icon' 

const renderMenuTitle = (meta: RouteMeta) => {
    const { title = 'Please set title', icon } = meta

    return icon ? (
        <>
            <Icon name={icon}></Icon>
            <span class="v-menu__title">{title}</span>
        </>
    ) : (
        <span class="v-menu__title">{title}</span>
    )
}

const renderMenuItem = (routes, parentPath = '/') => {
    return routes.map((v) => {
        const meta = (v.meta ?? {}) as RouteMeta
        if (!meta.hidden) {
            const { oneShowingChild, onlyOneChild } = hasOneShowingChild(v.children, v)
            const fullPath = isUrl(v.path) ? v.path : pathResolve(parentPath, v.path) // getAllParentPath<AppRouteRecordRaw>(allRouters, v.path).join('/')

            if (
                oneShowingChild &&
          (!onlyOneChild?.children || onlyOneChild?.noShowingChildren) &&
          !meta?.alwaysShow
            ) {
                return (
                    <el-menu-item index={onlyOneChild ? pathResolve(fullPath, onlyOneChild.path) : fullPath}>
                        {{
                            default: () => renderMenuTitle(onlyOneChild ? onlyOneChild?.meta : meta)
                        }}
                    </el-menu-item>
                )
            } else {
                return (
                    <el-sub-menu
                        index={fullPath}
                    >
                        {{
                            title: () => renderMenuTitle(meta),
                            default: () => renderMenuItem(v.children!, fullPath)
                        }}
                    </el-sub-menu>
                )
            }
        }
    })
}

export default defineComponent({
    props: {
        routes: propTypes.object
    },
    setup(props) {
        return () => {
            return renderMenuItem(props.routes)
        }    
    }
})



</script>
