import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

import tupLogo from "../asset/tupLogo.png";
import MarcialDP from "../asset/MarcialDP.jpg";
import LesterDP from "../asset/LesterDP.jpg";
import JanDP from "../asset/JanDP.jpg";
import AlbertDP from "../asset/AlbertDP.jpg";
import JonasDP from "../asset/JonasDP.jpg";
import AeromDP from "../asset/AeromDP.jpg";

const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette,
    padding: theme.spacing(1, 0, 1),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '100%', // 16:9
  },
  cardContent: {
    color: "#ffffff",
    backgroundColor: "#bf1d38",
    flexGrow: 1,
  },
  cardContent2:{
    fontWeight: "bold",
  },
  footer: {
    backgroundColor: theme.palette,
    padding: theme.spacing(6,0,2),
  },
}));

const cards = [1];

export default function About() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography  variant="h3" align="center" color="textPrimary" gutterBottom>
              Payroll System
            </Typography>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">

          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={MarcialDP}
                    title="Marcial Zipagan Jr."
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Marcial Zipagan Jr.
                    </Typography>
                    <Typography className={classes.cardContent2}>
                      Project Manager
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={LesterDP}
                    title="Lester De Guzman"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                     Lester De Guzman
                    </Typography>
                    <Typography className={classes.cardContent2}>
                      Backend 
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={JanDP}
                    title="Jan Erickson Bataclan"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Jan Erickson Bataclan
                    </Typography>
                    <Typography className={classes.cardContent2}>
                      Backend
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={AlbertDP}
                    title="Albert John Tulop"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                     Albert John Tulop
                    </Typography>
                    <Typography className={classes.cardContent2}>
                      Frontend Leader
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={JonasDP}
                    title="Jonas Andrei Ballarta"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                     Jonas Andrei Ballarta
                    </Typography>
                    <Typography className={classes.cardContent2}>
                      Frontend
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={AeromDP}
                    title="Aerom Von Canimo"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                     Aerom Von Canimo
                    </Typography>
                    <Typography className={classes.cardContent2}>
                      Frontend
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

          </Grid>
        </Container>
      </main>

      <footer className={classes.footer}>
        <Link to="/">
          <center>
            <img src={tupLogo} alt="logo" width="55" />
          </center>
        </Link>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Site by BSCS-NS-3A
        </Typography>
        <Copyright />
      </footer>
    </React.Fragment>
  );
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://tup-payroll.web.app/">
        TUP Payroll System
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
