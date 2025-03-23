import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  Divider,
  IconButton,
  Stack
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper',
        pt: 6,
        pb: 3,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Code Chef
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Empowering developers with the tools and resources they need to create amazing applications.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton aria-label="facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton aria-label="instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton aria-label="linkedin">
                <LinkedInIcon />
              </IconButton>
              <IconButton aria-label="github">
                <GitHubIcon />
              </IconButton>
            </Box>
          </Grid>
          
          {/* Products */}
          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Products
            </Typography>
            <Stack>
              <Link href="#" color="text.secondary" sx={{ mb: 1 }}>
                Code Editor
              </Link>
              <Link href="#" color="text.secondary" sx={{ mb: 1 }}>
                Recipes
              </Link>
              <Link href="#" color="text.secondary" sx={{ mb: 1 }}>
                Components
              </Link>
              <Link href="#" color="text.secondary" sx={{ mb: 1 }}>
                Extensions
              </Link>
            </Stack>
          </Grid>
          
          {/* Resources */}
          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Resources
            </Typography>
            <Stack>
              <Link href="#" color="text.secondary" sx={{ mb: 1 }}>
                Documentation
              </Link>
              <Link href="#" color="text.secondary" sx={{ mb: 1 }}>
                Tutorials
              </Link>
              <Link href="#" color="text.secondary" sx={{ mb: 1 }}>
                Blog
              </Link>
              <Link href="#" color="text.secondary" sx={{ mb: 1 }}>
                Changelog
              </Link>
            </Stack>
          </Grid>
          
          {/* Company */}
          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Company
            </Typography>
            <Stack>
              <Link href="#" color="text.secondary" sx={{ mb: 1 }}>
                About Us
              </Link>
              <Link href="#" color="text.secondary" sx={{ mb: 1 }}>
                Careers
              </Link>
              <Link href="#" color="text.secondary" sx={{ mb: 1 }}>
                Contact
              </Link>
              <Link href="#" color="text.secondary" sx={{ mb: 1 }}>
                Legal
              </Link>
            </Stack>
          </Grid>
          
          {/* Contact */}
          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              info@codechef.com
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              +1 (123) 456-7890
            </Typography>
            <Typography variant="body2" color="text.secondary">
              1234 Tech Avenue, San Francisco, CA 94107
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ mt: 5, mb: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            © 2024 Code Chef, Inc. All rights reserved.
          </Typography>
          <Box>
            <Link href="#" color="text.secondary" sx={{ ml: 2 }}>
              Privacy Policy
            </Link>
            <Link href="#" color="text.secondary" sx={{ ml: 2 }}>
              Terms of Service
            </Link>
            <Link href="#" color="text.secondary" sx={{ ml: 2 }}>
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;