import React, { useEffect } from "react";
import "./Nav.css";
import { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CartIcon from "@mui/icons-material/ShoppingCart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Container } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectUser, setUser } from "../../Slices/UserSlice";
import Login from "./Login";
import { User } from "../../Types/User";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { UserAccount } from "../../Types/UserAccount";
import zIndex from "@mui/material/styles/zIndex";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function Nav() {
  const user: User = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loginEl, setLoginEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  const [showLogin, setShowLogin] = useState<boolean>(false);

  let isMenuOpen = Boolean(anchorEl);
  let isLoginOpen = Boolean(loginEl);
  let isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    isMobileMenuOpen = false;
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    //isMenuOpen = false;

    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const doLogout = () => {
    isMenuOpen = false;
    isLoginOpen = false;
    setShowLogin(false);
    dispatch(
      setUser({
        _id: "",
        Name: "",
        Email: "",
        Password: "",
        Cart: [],
        RecentlyViewed: [],
        Type: UserAccount.Customer,
      })
    );
    if (cookies.token) {
      removeCookie("token", { path: "/" });
    }
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={doLogout}>Logout</MenuItem>
      {user.Type === UserAccount.Admin && (
        <Link to="/admin/addItem">
          <MenuItem
            sx={{
              color: "black",
            }}
          >
            Add Item
          </MenuItem>
        </Link>
      )}
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <p>Logout</p>
      </MenuItem>
      {user.Type === UserAccount.Admin && (
        <Link to="/admin/addItem">
          <MenuItem
            onClick={handleMenuClose}
            sx={{
              color: "black",
            }}
          >
            Add Item
          </MenuItem>
        </Link>
      )}
    </Menu>
  );

  useEffect(() => {
    // handleMenuClose;
    if (user.Name.length > 0) {
      setShowLogin(false);
    } else {
      handleMenuClose;
    }
  }, [user]);

  return (
    <Box sx={{ flexGrow: 1, width: "100%" }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Link to="/">
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" }, color: "#ffffff" }}
            >
              Rocker Webshop
            </Typography>
          </Link>
          <Search sx={{ width: "100%" }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              sx={{ width: "100%" }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          {user.Name.length > 0 && (
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Link to="/cart" color="white">
                <IconButton
                  size="large"
                  aria-label="show cart"
                  sx={{
                    color: "#ffffff",
                  }}
                >
                  <Badge
                    badgeContent={user.Cart ? user.Cart.length : 0}
                    color="secondary"
                  >
                    <CartIcon />
                  </Badge>
                </IconButton>
              </Link>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
          )}
          {user.Name.length > 0 && (
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <Link to="/cart" color="white">
                <IconButton
                  size="large"
                  aria-label="show cart"
                  sx={{
                    color: "#ffffff",
                  }}
                >
                  <Badge
                    badgeContent={user.Cart ? user.Cart.length : 0}
                    color="secondary"
                  >
                    <CartIcon />
                  </Badge>
                </IconButton>
              </Link>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          )}
          {user.Name.length === 0 && (
            <Box sx={{ display: { xs: "flex" } }}>
              <Typography
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={() => {
                  console.log(isLoginOpen);
                  setShowLogin(true);
                }}
              >
                Login
              </Typography>
              {showLogin && (
                <Container>
                  <div className="background-exit" onClick={()=>setShowLogin(false)}></div>
                  <Container
                    sx={[
                      { display: { xs: "flex", sm: "block" } },
                      { width: { xs: "100vw", sm: "auto" } },
                      {
                        position: "fixed",
                        top: "6vh",
                        right: 5,
                        background: "white",
                        zIndex: 120
                      },
                    ]}
                  >
                    <Login />
                  </Container>
                </Container>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {/* {!(user.Name.length > 0) && renderLogin} */}
    </Box>
  );
}
