import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MemoryIcon from '@mui/icons-material/Memory';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { styled } from '@mui/material/styles';
import { useTab } from '../Context/TabContext';

const SubmissionTab = () => {
    const { setOpenDetailSubmission, setSubmissionStatus, setSubmissionData } = useTab();
    const handleClickRow = (submission, status) => {
        console.log('row clicked', submission);
        setOpenDetailSubmission(true);
        setSubmissionStatus(status);
        setSubmissionData(submission);



    }
    const submissions = [
        {
            id: 1,
            status: "Accepted",
            createdAt: "2023-01-01T00:00:00Z",
            language: "java",
            runtime: 28,
            memory: 43.5,

            code: `public class Solution {
    public int strangePrinter(String s) {
        int n = s.length();
        if (n == 0) return 0;
        
        // Mảng dp[i][j] lưu trữ số lần in tối thiểu để in chuỗi con s[i...j]
        int[][] dp = new int[n][n];
        
        for (int i = n - 1; i >= 0; i--) {
            dp[i][i] = 1; // Chuỗi chỉ có 1 ký tự cần 1 lượt in
            for (int j = i + 1; j < n; j++) {
                dp[i][j] = dp[i][j - 1] + 1; // Giả định in thêm ký tự s[j]
                
                for (int k = i; k < j; k++) {
                    if (s.charAt(k) == s.charAt(j)) {
                        dp[i][j] = Math.min(dp[i][j], dp[i][k] + (k + 1 <= j - 1 ? dp[k + 1][j - 1] : 0));
                    }
                }
            }
        }
        
        return dp[0][n - 1];
    }
}`
        },
        {
            id: 2,
            status: "Wrong Answer",
            createdAt: "2023-09-01T00:00:00Z",
            language: "javascript",
            runtime: "false",
            memory: "false",

            code: `class Solution {
    public int strangePrinter(String s) {
        int n = s.length();
        int sum = 1;
        char[] fi = s.toCharArray();
        char fChar = findMostFrequentChar(s);
        System.out.println(fChar);
        char[] se = new char[n];
        for(int i = 0; i < n; i ++)
        {
            se[i] = fChar;
        }
        for(int i = 0; i < n; i++)
        {
            if(fi[i] != se[i])
            {
                sum++;
                char temp = fi[i];
                int end = findCharPos(s, se, temp);
                if(i ==0 && end == n - 1) 
                {
                    se[0] = temp;
                    se[end] = temp;
                }
                else if(end >= i ) 
                {
                    for(int j = i; j <= end; j ++)
                    {
                        se[j] = temp;
                    }
                    System.out.println(sum);
                    System.out.println(i + " " + end);
                    System.out.println(Arrays.toString(fi));
                    System.out.println(Arrays.toString(se));
                    System.out.println();
                }
                

            }

        }
        return sum;

    }

    public char findMostFrequentChar(String str) {
    Map<Character, Integer> charCountMap = new HashMap<>();

    // Duyệt qua chuỗi và đếm số lần xuất hiện của từng ký tự
    for (char c : str.toCharArray()) {
        charCountMap.put(c, charCountMap.getOrDefault(c, 0) + 1);
    }

    char mostFrequentChar = str.charAt(0); // Khởi tạo với ký tự đầu tiên
    int maxCount = charCountMap.get(mostFrequentChar);

    // Duyệt qua chuỗi theo thứ tự xuất hiện để tìm ký tự xuất hiện nhiều nhất
    for (char c : str.toCharArray()) {
        int currentCount = charCountMap.get(c);
        if (currentCount > maxCount) {
            mostFrequentChar = c;
            maxCount = currentCount;
        }
    }

    return mostFrequentChar;
}

    public int findCharPos(String s, char[] f,  char c)
    {
        for(int i = s.length() - 1; i >= 0 ; i--){
            if(s.charAt(i) == f[i]) continue;
            if(c == s.charAt(i)  ) return i;
        }
        return -1;
    }
    public boolean areCharArraysEqual(char[] array1, char[] array2) {
        // Nếu độ dài của hai mảng không bằng nhau, chúng không thể giống nhau
        if (array1.length != array2.length) {
            return false;
        }

        // So sánh từng phần tử của hai mảng
        for (int i = 0; i < array1.length; i++) {
            if (array1[i] != array2[i]) {
                return false;
            }
        }

        // Nếu tất cả phần tử đều giống nhau, trả về true
        return true;
    }
    
}`

        },
        {
            id: 3,
            status: "Runtime Error",
            createdAt: "2023-10-03T03:12:12Z",
            language: "python",
            runtime: "false",
            memory: "false",

            code: `class Solution {
    public int strangePrinter(String s) {
        HashSet<Character> hset = new HashSet<>();
        int sum = 0;
        for(int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if(hset.add(c)) sum++;
            hset.add(c);

        }
        return sum - dupli(s);

    }
    public int dupli(String s)
    {
        int sum = 0;
        for(int i = 0 ; i < s.length(); i++)
        {
            if (s.charAt(i) == s.charAt(i + 1))
            {
                sum ++;
            }
        }
        return sum;
    }
}`
        },
        {
            id: 4,
            status: "Compiler Error",
            createdAt: "2023-09-14T23:12:00Z",
            language: "javascript",
            runtime: "false",
            memory: "false",

            code: `class Solution {
    public int strangePrinter(String s) {
        HashSet<Character> hset = new HashSet<>();
        int sum = 0;
        for(int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if(hset.add(c)) sum++;
            hset.add(c);

        }
        return sum - dupli(s);

    }
    public int dupli(String s)
    {
        int sum = 0;
        for(int i = 0 ; i < s.length(); i++)
        {
            if (s.charAt(i) == s.charAt(i + 1))
            {
                sum ++;
            }
        }
        return sum;
    }
}`
        }
    ]

    const [sortDirection, setSortDirection] = useState('desc'); // Trạng thái để theo dõi hướng sắp xếp

    // Hàm để sắp xếp submissions theo thời gian
    const sortedSubmissions = [...submissions].sort((a, b) => {
        return sortDirection === 'desc'
            ? new Date(b.createdAt) - new Date(a.createdAt) // Sắp xếp giảm dần (mới nhất trước)
            : new Date(a.createdAt) - new Date(b.createdAt); // Sắp xếp tăng dần (cũ nhất trước)
    });

    // Hàm để xử lý sự kiện click vào tiêu đề
    const handleSort = () => {
        setSortDirection(prevDirection => (prevDirection === 'desc' ? 'asc' : 'desc'));
    };

    const EffectArrowBackIcon = styled(ArrowBackIosNewIcon)(({ rotate }) => ({
        transform: `rotate(${rotate})`,
        transition: 'transform 0.3s ease',

    }));
    // xử lý màu xen kẽ cho các row
    const StyledTableRow = styled(TableRow)(({ theme, index }) => ({

        '&:nth-of-type(odd)': {
            backgroundColor: '#f7f7f8',
            '& > *': {
                color: theme.palette.getContrastText('#f7f7f8'),
            },
        },
        '&:nth-of-type(even)': {
            backgroundColor: 'transparent',
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
            cursor: 'pointer',
        },
    }));

    return (
        <div>
            <TableContainer
                style={{
                    maxHeight: '85vh',
                    maxWidth: '100%',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead classname="mb-4">
                        <TableRow className="bg-transparent">
                            <TableCell
                                sx={{
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap',
                                    width: '40%'
                                }}
                                onClick={handleSort}
                                style={{ cursor: 'pointer' }}>
                                <div className="flex flex-row justify-start items-center gap-1">
                                    <Typography
                                        sx={{
                                            fontWeight: 'bold',
                                            whiteSpace: 'nowrap',
                                        }}>Status</Typography>
                                    <EffectArrowBackIcon rotate={sortDirection === "desc" ? '-90deg' : '90deg'} />

                                </div>

                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', width: '20%' }}>
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        whiteSpace: 'nowrap',
                                    }}>Language</Typography>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', width: '20%' }}><Typography
                                sx={{
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap',
                                }}>Runtime</Typography></TableCell>
                            <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', width: '20%' }}><Typography
                                sx={{
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap',
                                }}>Memory</Typography></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {sortedSubmissions.map((submission, index) => (
                            <StyledTableRow key={index} onClick={() => handleClickRow(submission, submission.status)}>
                                <TableCell sx={{ width: '40%', whiteSpace: 'nowrap' }} >
                                    <div className="flex flex-col justify-center items-start" >
                                        <Typography
                                            fontSize="1.2rem"
                                            fontWeight="bold"
                                            sx={{
                                                color: submission.status.toLowerCase() === "accepted" ? "#3fb55d" : "#ef4743",
                                                textTransform: "capitalize",
                                            }}

                                        >
                                            {submission.status}
                                        </Typography>
                                        <Typography
                                            fontSize="0.8rem"
                                        >

                                            {/* {new Date(submission.createdAt).toUTCString()} */}
                                            {new Date(submission.createdAt).toLocaleString('en-GB', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}

                                        </Typography>

                                    </div>

                                </TableCell>
                                <TableCell sx={{ width: '20%', whiteSpace: 'nowrap', textTransform: "capitalize", }}>
                                    {submission.language}
                                </TableCell>
                                <TableCell sx={{ width: '20%', whiteSpace: 'nowrap', }}>
                                    <div className="flex flex-row justify-start items-center gap-1">
                                        <AccessTimeIcon />
                                        <div>
                                            {submission.runtime === "false" ? "N/A" : `${submission.runtime} ms`}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell sx={{ width: '20%', whiteSpace: 'nowrap', }}>
                                    <div className="flex flex-row justify-start items-center gap-1">
                                        <MemoryIcon />
                                        <div>
                                            {submission.memory === "false" ? "N/A" : `${submission.memory} MB`}
                                        </div>
                                    </div>
                                </TableCell>

                            </StyledTableRow>
                        ))}

                    </TableBody>

                </Table>
            </TableContainer>
        </div>
    )
}

export default SubmissionTab
