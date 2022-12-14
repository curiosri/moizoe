import { Box, Button, createTheme, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, ThemeProvider, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Post } from "../../app/models/post";
import ReactHtmlParser from 'react-html-parser';
import agent from "../../app/api/agent";
import DOMPurify from 'dompurify';


export default function PostDetails() {
    const {id} = useParams<{id: string}>();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(false);

    // get the individual post content
    useEffect(() => {
        agent.Catalog.details(parseInt(id))
        .then(response => setPost(response))
        .catch(error => console.log(error)) // error.reponse gives the full axios error details
        .finally(() => setLoading(false));
    }, [id])

    if (loading) return <h2> Loading </h2>

    if (!post) return <h2></h2>

    // delete the individual post
    function handleDeletePost(id: string) {
        agent.Catalog.delete(parseInt(id))
        .then((response) => {
            console.log(response);
            window.location.href = 'http://localhost:7231/' 
          })
        .catch(error =>console.log(error))
        .finally(() => setLoading(false));
    }
        
    const titletheme = createTheme({
        typography: {
          allVariants: {
            fontFamily: 'Poppins',
            textTransform: 'none',
            fontSize: 25,
            fontWeight: 'bold'
          },
        },
        
      }  
      );
    
    const texttheme = createTheme({
        typography: {
          allVariants: {
            fontFamily: 'Noto Sans KR',
            textTransform: 'none',
            fontSize: 19
          },
        },
        
      }  
      );

    return (
        <>
         
            <ThemeProvider theme={titletheme}>
            <Grid container spacing={1} width='95.5%'>
            
            <Grid>
                <Grid item xs={15}>
                    <TableContainer>
                    <div className="table" style={{width:'100%' }}>
                        <Table sx={{width: '100%'}} >
                            <TableBody sx={{width: '100%'}}>
                                <TableRow>
                                <ThemeProvider theme={titletheme}>
                                    <TableCell><Typography>{post.title}
                                    </Typography></TableCell></ThemeProvider>
                                </TableRow>
                                <ThemeProvider theme={texttheme}>
                                <TableRow><Typography align="right">{(post.timestamp).toLocaleString()}</Typography></TableRow>
                                <TableRow>
                                    <TableCell><Typography>
                                    <React.Fragment> 
                                                        
                                    <div style={{ whiteSpace: 'pre-wrap' }} >
                                        {ReactHtmlParser(DOMPurify.sanitize(post.text))} 
                                    </div>
                                    </React.Fragment>
                                    </Typography></TableCell>
                                </TableRow> 
                                </ThemeProvider>
                            </TableBody>
                        </Table></div>
                    </TableContainer>
                </Grid>
                <Grid item xs={15}>
                
                <Button size="large"  sx={{left: "0%"}} href={`/posts/${post.id}/update` }>
                    EDIT
                </Button>
                
                <Button size="large"  sx={{left: "0%"}} 
                onClick={() => handleDeletePost(id)} >
                    DELETE
                </Button>
                    
                </Grid>
            </Grid>
            
        </Grid>
        </ThemeProvider>
     


        </>
        
    )
    }