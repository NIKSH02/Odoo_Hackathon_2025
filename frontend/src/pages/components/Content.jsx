import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import RecyclingIcon from '@mui/icons-material/Recycling';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import { SitemarkIcon } from './CustomIcons';

const items = [
  {
    icon: <SwapHorizRoundedIcon sx={{ color: 'primary.main' }} />,
    title: 'Easy Clothing Exchange',
    description:
      'Swap your pre-loved clothes with others instantly. Find unique pieces while giving your wardrobe a fresh new look.',
  },
  {
    icon: <RecyclingIcon sx={{ color: 'success.main' }} />,
    title: 'Sustainable Fashion',
    description:
      'Reduce textile waste and promote circular fashion. Every swap helps create a more sustainable and eco-friendly future.',
  },
  
];

export default function Content() {
  return (
    <Stack
      sx={{ 
        flexDirection: 'column', 
        alignSelf: 'center', 
        gap: 3, 
        maxWidth: 500,
        px: 2 
      }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' }, mb: 2 }}>
        <SitemarkIcon />
      </Box>
      
      {/* Main heading */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main',
            mb: 1
          }}
        >
          Why Choose Rewear?
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            fontSize: '1.1rem'
          }}
        >
          Join thousands of fashion-conscious users who are transforming their wardrobes sustainably
        </Typography>
      </Box>

      {items.map((item, index) => (
        <Stack 
          key={index} 
          direction="row" 
          sx={{ 
            gap: 2,
            p: 2,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'action.hover',
              transform: 'translateY(-2px)',
              boxShadow: 1
            }
          }}
        >
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: 'background.paper',
            boxShadow: 1
          }}>
            {item.icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                fontSize: '1.1rem',
                color: 'text.primary'
              }}
            >
              {item.title}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                lineHeight: 1.6
              }}
            >
              {item.description}
            </Typography>
          </Box>
        </Stack>
      ))}
      
      {/* Call to action */}
      
    </Stack>
  );
}