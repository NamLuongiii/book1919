# Epub là một chuẩn sách điện tử

- Một Epub Publication là một tập hợp files được đóng gói vào 1 file zip
- Tệp Epub giúp cho tác giả hoặc đơn vị xuất bản đưa tác phẩm của mình lên không gian số
- Epub là một tiêu chuẩn để định nghĩa một ấn phẩm vật lý thành ấn phẩm điện tử, bao gồm các hướng dẫn và các quy tắc để tạo ra các ấn bản số , cũng như
  các phầm mềm đọc sách điện tử
- Epub dựa trên những công nghệ Web và một số công nghệ khác để định nghĩa một ấn phẩm sách bao gồm chuẩn Html xác định cấu trúc của sách, chuẩn Css cung cấp khả năng trang trí, SVG, MATH ML, công nghệ Zip, chuẩn đóng gói OCF, ...
- Epub là một định dạng phổ biến để tạo sách điện tử

# Tạo một trình đọc file epub

## Phân giải file zip

- Cần giải mã file zip thành tập hợp các file, đây chính là các file ban đầu do người tạo epub xây dựng lên, việc giải nén file zip luôn cho ta 1 folder
  , bên trong folder gồm các file và folder con, ta cần phân tích các file này với đúng định dạng của nó để tiếp tục xử lý

Cấu trúc file và directory

- [Folder]

  - mimetype [required]
  - [Folder] META-INF [required]
    -- container.xml [required]

- mimetype là 1 file được mã hóa bằng định dạng US-ASCII, nội dung bắt buộc trong file này phải là [application/epub+zip]
  file này giúp xác định rằng file zip đang xét đến tuân theo tiêu chuẩn Epub, Reading System nên đọc file này đầu tiên để validate tệp zip

- container.xml chứa thông tin về một hoặc nhiều package-document, đường dẫn href là một trong số các thông tin, giúp Reading System tìm tới package-document

- Cần xác định được cấu trúc bên trong các file để phân tích đúng, trình Reading System cần phân tích thông tin trong 3 file bắt buộc đầu tiên để thao tác

## Phân tích dữ liệu theo chuẩn đóng gói của Epub

# Thuật ngữ

Reading System

- Trình đọc file epub

Epub Publication

- Một file epub, một ấn bản sách điện tử

Viewport

- Thuộc về Reading System chỉ vùng hiển thị một Epub Publication

Package Document

- Là các file có đuôi opf, có định dạng mã hóa là XML, trong đó đóng gói thông tin về Epub Publication, gồm metadata, spine , manifest
  , trình Reading System sẽ dựa vào thông tin trong file này để thao tác như hiển thị các chương sách theo thứ tự, lấy thông tin tác giả, tên sách ,...

# Expresing Structural Semantic

- Chỉ một attribute [epub:type] có value là đươc định nghĩa sẵn, Epub creator có thể tự định nghĩa value mới nhưng khuyến nghị nên sử dụng danh sách
  đã chuẩn hóa vì mục đích hỗ trợ rộng bởi các trình Reading System

- Epub:type thêm thông tin cho các thẻ XHTML
