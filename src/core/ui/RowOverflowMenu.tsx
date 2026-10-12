import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/core/theme/ThemeProvider';

export type OverflowMenuItem = {
  label: string;
  onPress: () => void;
};

type RowOverflowMenuProps = {
  visible: boolean;
  onClose: () => void;
  items: OverflowMenuItem[];
};

export function RowOverflowMenu({ visible, onClose, items }: RowOverflowMenuProps) {
  const { tokens } = useTheme();

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <Pressable
        accessibilityLabel="Close menu"
        accessibilityRole="button"
        onPress={onClose}
        style={styles.backdrop}
      >
        <View style={[styles.menuCard, { backgroundColor: tokens.surface }]}>
          {items.map((item, index) => (
            <Pressable
              key={item.label}
              accessibilityRole="button"
              onPress={() => {
                onClose();
                item.onPress();
              }}
              style={({ pressed }) => [
                styles.menuItem,
                index < items.length - 1 && styles.menuItemBorder,
                {
                  borderBottomColor: tokens.textMuted,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={[styles.menuLabel, { color: tokens.text }]}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  menuCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 8,
    overflow: 'hidden',
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuLabel: {
    fontSize: 16,
    lineHeight: 22,
  },
});
