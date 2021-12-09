import React, { useState } from 'react';
import { useRouter } from "next/router";
import { Collapse, Grid } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { WebMenuItem } from '../../../sub_modules/share/model/webMenuItem';
import iconItemMenu from '../../../public/images/icons/icon-item-menu.png';

const MenuChild = (props: { item: WebMenuItem, mapItem: { [itemId: string]: WebMenuItem[] } }) => {
    const { item, mapItem } = props;
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    const showMenu = (mapMenu: { [itemId: string]: WebMenuItem[] }, item: WebMenuItem, depth = 0) => {
        return (
            <>
                {mapMenu[item._id].map((menuC) => (
                    <Grid item key={menuC._id} xs={6} style={{ fontSize: "14px", maxWidth: "100%" }}>
                        {depth === 0 ? <span onClick={() => router.push(menuC.url)} style={{ fontWeight: 600 }}>{menuC.title}</span> : <span onClick={() => router.push(menuC.url)}>{menuC.title}</span>}
                        <div>{mapItem[menuC._id]?.length > 0 && showMenu(mapItem, menuC, depth + 1)}</div>
                    </Grid>
                ))}
            </>
        )
    }

    return (
        <>
            <span style={{ display: 'flex', alignItems: 'center' }}><img src={iconItemMenu} alt="iconItemMenu" /><span onClick={() => router.push(item.url)}>{item.title}</span> <ExpandMoreIcon onClick={() => setChecked(!checked)} /></span>
            <Collapse in={checked}>
                <Grid container spacing={2}>
                    {showMenu(mapItem, item, 0)}
                </Grid>
            </Collapse>
        </>
    )
}

export default MenuChild