import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  globalCss: {
    html: {
      colorScheme: 'light',
      _dark: { colorScheme: 'dark' },
    },
    body: {
      bg: 'bg.canvas',
      color: 'text.primary',
    },
  },
  theme: {
    tokens: {
      colors: {
        paper: {
          canvas: { value: '#FBFAF7' },
          raised: { value: '#FFFFFF' },
          muted: { value: '#F5F3EE' },
          subtle: { value: '#EFECE4' },
        },
        charcoal: {
          canvas: { value: '#1A1D24' },
          content: { value: '#1F232B' },
          raised: { value: '#242830' },
          muted: { value: '#2C313A' },
          subtle: { value: '#323845' },
        },
        ink: {
          DEFAULT: { value: '#161A23' },
          soft: { value: '#2B303C' },
          inverse: { value: '#F4F2EC' },
        },
        mist: {
          DEFAULT: { value: '#7A7E86' },
          soft: { value: '#9CA0A6' },
        },
        haze: {
          DEFAULT: { value: '#9AA0A8' },
          soft: { value: '#C4C7CC' },
        },
        rule: {
          DEFAULT: { value: '#E6E2D9' },
          dark: { value: '#3A404C' },
          soft: { value: '#EFECE4' },
          softDark: { value: '#2E333D' },
        },
        brand: {
          500: { value: '#5B4CC4' },
          600: { value: '#4D3EB5' },
          400: { value: '#7B6FE0' },
          soft: { value: '#EFEBFB' },
          softDark: { value: '#2E2A45' },
        },
        danger: {
          500: { value: '#C43333' },
          400: { value: '#E05A5A' },
          soft: { value: '#FBEAEA' },
          softDark: { value: '#3A2424' },
          border: { value: '#F0C7C7' },
          borderDark: { value: '#5A3232' },
        },
        stamp: {
          500: { value: '#C4661F' },
          400: { value: '#E08A3C' },
          soft: { value: '#FBEEE1' },
          softDark: { value: '#3A2E22' },
        },
        draft: {
          500: { value: '#8B8F97' },
          400: { value: '#A8ADB5' },
          soft: { value: '#F0EFED' },
          softDark: { value: '#2E3238' },
        },
        review: {
          500: { value: '#C4661F' },
          400: { value: '#E08A3C' },
          soft: { value: '#FBEEE1' },
          softDark: { value: '#3A2E22' },
        },
        approved: {
          500: { value: '#2B6CB0' },
          400: { value: '#5B9BD4' },
          soft: { value: '#E9F1FA' },
          softDark: { value: '#1E2F42' },
        },
        scheduled: {
          500: { value: '#6E4CC4' },
          400: { value: '#9B82E0' },
          soft: { value: '#EFEAFA' },
          softDark: { value: '#2E2745' },
        },
        published: {
          500: { value: '#2F8F5B' },
          600: { value: '#25754A' },
          400: { value: '#4DBA7A' },
          soft: { value: '#E9F6EF' },
          softDark: { value: '#1E3328' },
        },
        code: {
          bg: { value: '#1E2229' },
          header: { value: '#252A33' },
          border: { value: '#323845' },
          input: { value: '#2C313A' },
        },
      },
      radii: {
        editorial: { value: '10px' },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: {
            value: {
              _light: '{colors.paper.canvas}',
              _dark: '{colors.charcoal.canvas}',
            },
          },
          canvas: {
            value: {
              _light: '{colors.paper.canvas}',
              _dark: '{colors.charcoal.canvas}',
            },
          },
          content: {
            value: {
              _light: '{colors.paper.canvas}',
              _dark: '{colors.charcoal.content}',
            },
          },
          surface: {
            value: {
              _light: '{colors.paper.raised}',
              _dark: '{colors.charcoal.raised}',
            },
          },
          muted: {
            value: {
              _light: '{colors.paper.muted}',
              _dark: '{colors.charcoal.muted}',
            },
          },
          subtle: {
            value: {
              _light: '{colors.paper.subtle}',
              _dark: '{colors.charcoal.subtle}',
            },
          },
          panel: {
            value: {
              _light: '{colors.paper.raised}',
              _dark: '{colors.charcoal.raised}',
            },
          },
          overlay: {
            value: {
              _light: 'rgba(22, 26, 35, 0.72)',
              _dark: 'rgba(10, 12, 16, 0.78)',
            },
          },
        },
        text: {
          primary: {
            value: {
              _light: '{colors.ink}',
              _dark: '{colors.ink.inverse}',
            },
          },
          secondary: {
            value: {
              _light: '{colors.ink.soft}',
              _dark: '{colors.haze.soft}',
            },
          },
          muted: {
            value: {
              _light: '{colors.mist}',
              _dark: '{colors.haze}',
            },
          },
          inverse: {
            value: {
              _light: '{colors.paper.raised}',
              _dark: '{colors.ink.inverse}',
            },
          },
        },
        fg: {
          DEFAULT: {
            value: {
              _light: '{colors.ink}',
              _dark: '{colors.ink.inverse}',
            },
          },
          muted: {
            value: {
              _light: '{colors.mist}',
              _dark: '{colors.haze}',
            },
          },
          subtle: {
            value: {
              _light: '{colors.mist.soft}',
              _dark: '{colors.haze}',
            },
          },
        },
        border: {
          DEFAULT: {
            value: {
              _light: '{colors.rule}',
              _dark: '{colors.rule.dark}',
            },
          },
          default: {
            value: {
              _light: '{colors.rule}',
              _dark: '{colors.rule.dark}',
            },
          },
          subtle: {
            value: {
              _light: '{colors.rule.soft}',
              _dark: '{colors.rule.softDark}',
            },
          },
          muted: {
            value: {
              _light: '{colors.rule}',
              _dark: '{colors.rule.dark}',
            },
          },
        },
        accent: {
          solid: {
            value: {
              _light: '{colors.brand.500}',
              _dark: '{colors.brand.400}',
            },
          },
          hover: {
            value: {
              _light: '{colors.brand.600}',
              _dark: '{colors.brand.500}',
            },
          },
          subtle: {
            value: {
              _light: '{colors.brand.soft}',
              _dark: '{colors.brand.softDark}',
            },
          },
          fg: {
            value: {
              _light: '{colors.brand.500}',
              _dark: '{colors.brand.400}',
            },
          },
        },
        danger: {
          solid: {
            value: {
              _light: '{colors.danger.500}',
              _dark: '{colors.danger.400}',
            },
          },
          hover: {
            value: {
              _light: '#A82B2B',
              _dark: '{colors.danger.500}',
            },
          },
          subtle: {
            value: {
              _light: '{colors.danger.soft}',
              _dark: '{colors.danger.softDark}',
            },
          },
          fg: {
            value: {
              _light: '{colors.danger.500}',
              _dark: '{colors.danger.400}',
            },
          },
          border: {
            value: {
              _light: '{colors.danger.border}',
              _dark: '{colors.danger.borderDark}',
            },
          },
          overlay: {
            value: {
              _light: 'rgba(196, 40, 40, 0.85)',
              _dark: 'rgba(196, 51, 51, 0.88)',
            },
          },
        },
        stamp: {
          solid: {
            value: {
              _light: '{colors.stamp.500}',
              _dark: '{colors.stamp.400}',
            },
          },
          subtle: {
            value: {
              _light: '{colors.stamp.soft}',
              _dark: '{colors.stamp.softDark}',
            },
          },
          fg: {
            value: {
              _light: '{colors.stamp.500}',
              _dark: '{colors.stamp.400}',
            },
          },
        },
        status: {
          draft: {
            fg: {
              value: {
                _light: '{colors.draft.500}',
                _dark: '{colors.draft.400}',
              },
            },
            subtle: {
              value: {
                _light: '{colors.draft.soft}',
                _dark: '{colors.draft.softDark}',
              },
            },
          },
          review: {
            fg: {
              value: {
                _light: '{colors.review.500}',
                _dark: '{colors.review.400}',
              },
            },
            subtle: {
              value: {
                _light: '{colors.review.soft}',
                _dark: '{colors.review.softDark}',
              },
            },
          },
          approved: {
            fg: {
              value: {
                _light: '{colors.approved.500}',
                _dark: '{colors.approved.400}',
              },
            },
            subtle: {
              value: {
                _light: '{colors.approved.soft}',
                _dark: '{colors.approved.softDark}',
              },
            },
          },
          scheduled: {
            fg: {
              value: {
                _light: '{colors.scheduled.500}',
                _dark: '{colors.scheduled.400}',
              },
            },
            subtle: {
              value: {
                _light: '{colors.scheduled.soft}',
                _dark: '{colors.scheduled.softDark}',
              },
            },
          },
          published: {
            fg: {
              value: {
                _light: '{colors.published.500}',
                _dark: '{colors.published.400}',
              },
            },
            subtle: {
              value: {
                _light: '{colors.published.soft}',
                _dark: '{colors.published.softDark}',
              },
            },
            hover: {
              value: {
                _light: '{colors.published.600}',
                _dark: '{colors.published.500}',
              },
            },
          },
        },
        code: {
          bg: { value: '{colors.code.bg}' },
          header: { value: '{colors.code.header}' },
          border: { value: '{colors.code.border}' },
          input: { value: '{colors.code.input}' },
        },
      },
      shadows: {
        xs: {
          value: {
            _light:
              '0 1px 2px rgba(22, 26, 35, 0.06), 0 1px 1px rgba(22, 26, 35, 0.04)',
            _dark: '0 1px 2px rgba(0, 0, 0, 0.28), 0 1px 1px rgba(0, 0, 0, 0.18)',
          },
        },
        sm: {
          value: {
            _light:
              '0 1px 2px rgba(22, 26, 35, 0.06), 0 1px 1px rgba(22, 26, 35, 0.04)',
            _dark: '0 1px 2px rgba(0, 0, 0, 0.28), 0 1px 1px rgba(0, 0, 0, 0.18)',
          },
        },
        md: {
          value: {
            _light:
              '0 4px 14px rgba(22, 26, 35, 0.08), 0 2px 4px rgba(22, 26, 35, 0.04)',
            _dark: '0 4px 14px rgba(0, 0, 0, 0.35), 0 2px 4px rgba(0, 0, 0, 0.22)',
          },
        },
        lg: {
          value: {
            _light:
              '0 12px 32px rgba(22, 26, 35, 0.14), 0 4px 10px rgba(22, 26, 35, 0.06)',
            _dark:
              '0 12px 32px rgba(0, 0, 0, 0.42), 0 4px 10px rgba(0, 0, 0, 0.28)',
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
