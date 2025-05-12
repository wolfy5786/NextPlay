import { ActionIcon, useMantineColorScheme, Group, rem } from '@mantine/core';
import { IconSun, IconMoon, IconSettings } from '@tabler/icons-react';

export function ThemeToggle() {
    const { colorScheme, setColorScheme } = useMantineColorScheme();

    return (
        <Group justify="center">
            <ActionIcon
                onClick={() => setColorScheme(colorScheme === 'light' ? 'dark' : colorScheme === 'dark' ? 'auto' : 'light')}
                variant="default"
                size="xl"
                aria-label="Toggle color scheme"
            >
                <IconSun display={colorScheme === 'light' ? 'block' : 'none'} width={rem(2.2)} height={rem(2.2)} stroke={1.5} />
                <IconMoon display={colorScheme === 'dark' ? 'block' : 'none'} width={rem(2.2)} height={rem(2.2)} stroke={1.5} />
                <IconSettings display={colorScheme === 'auto' ? 'block' : 'none'} width={rem(2.2)} height={rem(2.2)} stroke={1.5} />
            </ActionIcon>
        </Group>
    );
}