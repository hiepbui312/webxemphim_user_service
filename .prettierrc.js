module.exports = {
  // Cơ bản
  semi: true, // Luôn có dấu chấm phẩy
  singleQuote: true, // Dùng single quote thay vì double quote
  quoteProps: 'as-needed', // Chỉ quote object key khi cần thiết
  trailingComma: 'es5', // Trailing comma cho ES5 (objects, arrays)
  
  // Indentation & Spacing
  tabWidth: 2, // 2 spaces cho mỗi tab
  useTabs: false, // Dùng spaces thay vì tabs
  
  // Line length
  printWidth: 100, // Độ dài tối đa 100 ký tự (sync với ESLint max-len)
  
  // Brackets & Parentheses
  bracketSpacing: true, // Spaces trong object brackets: { foo: bar }
  bracketSameLine: false, // Đóng bracket trên dòng mới
  arrowParens: 'avoid', // Tránh parentheses cho arrow function 1 param: x => x
  
  // HTML/JSX (nếu có React components trong tương lai)
  htmlWhitespaceSensitivity: 'css',
  
  // End of line
  endOfLine: 'lf', // Unix line endings (LF)
  
  // Embedded languages
  embeddedLanguageFormatting: 'auto',
  
  // Override cho các file types cụ thể
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
        tabWidth: 2,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
        tabWidth: 2,
      },
    },
    {
      files: '*.yml',
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
    {
      files: '*.yaml',
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
  ],
}; 