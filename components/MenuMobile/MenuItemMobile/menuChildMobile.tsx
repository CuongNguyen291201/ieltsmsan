import React, { useState } from 'react';
import { useRouter } from "next/router";
import { Collapse, Grid, Link } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { WebMenuItem } from '../../../sub_modules/share/model/webMenuItem';
import iconItemMenu from '../../../public/images/icons/icon-item-menu.png';

const MenuChildMobile = (props: { item: WebMenuItem, mapItem: { [itemId: string]: WebMenuItem[] } }) => {
    const { item, mapItem } = props;
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    const showMenu = (mapMenu: { [itemId: string]: WebMenuItem[] }, item: WebMenuItem) => {
        return (
            <>
                {mapMenu[item._id].map((menuC) => (
                    <Grid item key={menuC._id} md={6} sm={12} xs={12}>
                        <Link href={menuC.url} underline="none" style={mapItem[menuC._id]?.length > 0 ? { fontSize: "14px", fontWeight: 600, color: "#000" } : { fontSize: "12px", color: "#000", paddingLeft: "10px" }}>{menuC.title}</Link>
                        <div>{mapItem[menuC._id]?.length > 0 && showMenu(mapItem, menuC)}</div>
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
                    {showMenu(mapItem, item)}
                </Grid>
            </Collapse>
        </>
    )
}

export default MenuChildMobile