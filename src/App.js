import React,{useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import   { db, auth }   from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from "react-instagram-embed";
import FlipMove from "react-flip-move";

function getModalStyle(){
  const top = 50;
  const left = 50; 

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles([]);
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);

  const [open, setOpen] = useState(false);

  const [openSignIn, setOpenSignIn] = useState('');

  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');

  const [email, setEmail] = useState('');

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        //user already has logged in...
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          // dont update username
        } else {
          return authUser.updateProfile({
            displayName: username,
          });
        }

      }else{
        //user has logged out...
        setUser(null);
      }
    });

    return () => {
      //perform some cleanup actions
      unsubscribe();
    };

  },[user, username]);

  // useEffect -> Runs a piece of code based on a specific condition
  useEffect(() => {
    //this is where the code runs 

    //-> collection name - posts in database
   db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
     // every time a new post is added, this code fires (the snapshot)
   
     // following loop works like for loop
     setPosts(snapshot.docs.map(doc => ({
       id: doc.id,
       post: doc.data()
      })));
    })

  }, []);//-> run everytime the variable posts changes

  const signUp = (event) => {
    event.preventDefault();
    auth
    .createUserWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false);

  }

  return (
    <div className="app">

    <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
      <div style={modalStyle} className={classes.paper}>
    <form className="app__signup">
     <center>
        <img
        className="app__headerImage"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png" 
        alt="header-image"
      />
     </center>
      <Input
      type="text"
      placeholder="username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}/>
      <Input
      type="text"
      placeholder="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}/>
      <Input
      type="password"
      placeholder="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}/>
     
      <Button type="submit" onClick={signUp}>Sign Up</Button>
     </form>
    </div>
        
    </Modal>

    <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
      <div style={modalStyle} className={classes.paper}>
    <form className="app__signup">
     <center>
        <img
        className="app__headerImage"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png" 
        alt="header-image"
      />
     </center>
     
      <Input
      type="text"
      placeholder="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}/>
      <Input
      type="password"
      placeholder="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}/>
     
      <Button type="submit" onClick={signIn}>Login</Button>
     </form>
    </div>
        
    </Modal>
      
    <div className="app__header">
    <img
        className="app__headerImage"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/840px-Instagram_logo.svg.png" 
        alt="header-image"
      />

     {user ?(
        <Button onClick={() => auth.signOut()}>Logout</Button>
        ):(
        <div className="app__loginContainer">
        <Button onClick={() => setOpenSignIn(true)}>Login</Button> 

        <Button onClick={() => setOpen(true)}>Sign Up</Button>
        </div>
    )}
   
    </div>
    <div className="app__posts">
        <div className="app__postsLeft">
          <FlipMove>
            {posts.map(({ id, post }) => (
              <Post
                user={user}
                key={id}
                postId={id}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
              />
            ))}
          </FlipMove>
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url='https://www.instagram.com/p/B_uf9dmAGPw/'
            clientAccessToken='123|456'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>


    {user?.displayName ? (
      <ImageUpload username={user.displayName}/>
    ):(
      <center>
         <h3>Login to upload</h3>
      </center>
     
    )}
  
    {/* <Post username="Gurmanpreet" caption="Amazing Vibes!" imageUrl="https://images.unsplash.com/photo-1629890993784-72fe9a730f07?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=60"/>
    <Post username="Anu" caption="Monday Blues:(" imageUrl="https://images.unsplash.com/photo-1586227740560-8cf2732c1531?ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1128&q=80"/>
    <Post username="Simran" caption="Serenity:)" imageUrl="https://images.unsplash.com/photo-1629872874038-b1d600221640?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"/> */}

  
    </div>
  );
}

export default App;
